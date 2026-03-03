import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import type { Response, Request } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { verifyToken } from './middleware/middleware.js'
import type { AuthRequest } from './middleware/middleware.js'
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: ['https://authentication-system-imz2.vercel.app', 'http://localhost:3000'],
    credentials: true
}))
mongoose.connect(process.env.DATABASE_NAME!).catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1)
  });
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    id: String
})
const users = mongoose.model('users', userSchema)
app.get('/verify-token', verifyToken, async (req: AuthRequest, res: Response) => {
    try{
        const token = req.cookies.token
        if (!token) {
           return res.status(401).json({ message: 'No token provided.' });
        }
        const user = await users.findOne({id: req.user.id})
        return res.status(200).json(user)
    }catch(error){
        return res.status(500).json({message: "Nope."})
    }
})
app.post('/sign-up', async (req: Request, res: Response) => {
    try{
        const {name, password, email, id} = req.body
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const anotherUser = await users.findOne({
            $or: [
                {email: email},
                {name: name}
            ]
        })
        if(anotherUser){
            return res.status(409).json({message: 'Users email or name already exists.'})
        }
        const newUser = new users({
            name,
            password: await bcrypt.hash(password, 10),
            email,
            id
        })
        await newUser.save()
        return res.status(201).json({ message: "User created successfully!" });
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Nope."})
    }
})
app.post('/log-in', async (req: AuthRequest, res: Response) => {
    try{
        const {password, email} = req.body
        const foundUser = await users.findOne({email})
        if (!foundUser) {
            return res.status(401).json({ message: 'Your password or email is wrong.' });
        }
        const isTheSame = await bcrypt.compare(password, foundUser?.password as string)
        if(!foundUser || !isTheSame){
            return res.status(404).json({message: 'Your password or email is wrong.'})
        }
        const token = jwt.sign({id: foundUser.id} as object, process.env.JWT_SECRET!, {expiresIn: '24h'})
        res.cookie('token', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(200).json(foundUser)
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Nope."})
    }
})
app.post('/sign-out', verifyToken, async (req: AuthRequest, res: Response) => {
    try{
        const token = req.cookies.token
        res.clearCookie('token', {
            sameSite: 'none',
            secure: true,
            httpOnly: true
        })
        return res.status(200).json({token})
    }catch(error){
        return res.status(500).json({message: "Yikes the server's ass got fucked bad..."})
    }
})
app.listen(Number(process.env.PORT) || 4500, '0.0.0.0', () => {
    console.log('Running on 4500')
})