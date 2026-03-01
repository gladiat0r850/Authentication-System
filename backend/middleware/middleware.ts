import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request  {
    user?: any
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if(!token) return res.status(401).json({message: 'Fuck off.'})
    try{
        const decoded = jwt.verify(token, 'blablabla')
        req.user = decoded
        next()
    }catch(error){
        console.log(error)
        return res.status(500).json({message: 'Something went wrong...yikes'})
    } 
}