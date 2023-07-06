import { db } from "@/lib/db";
import { UserCredentials } from "@/lib/validators";
import bcrypt from "bcrypt";

export async function POST(req:Request){
    try {
        const body = await req.json();
        const {email, password} = UserCredentials.parse(body);
        const userExists = await db.user.findFirst({
            where: {
                email,
            }
        });
        
        if(userExists) return new Response("A user with that email address already exists", {status: 409});

        bcrypt.hash(password, 10, async(err, hash) => {
            if(err) {
                console.log("err from hash", err)
                return new Response("There was an error registering the user.", {status: 500})};
            await db.user.create({
                data: {
                    email,
                    password: hash,
                }
            })
        })
        return new Response("OK");
    } catch (e) {
        console.log("err from catch", e)
        return new Response("There was an error registering the user.", {status: 500});
    }
    
    
}