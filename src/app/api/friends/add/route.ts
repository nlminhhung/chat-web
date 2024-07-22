import { addFriendValidate } from "@/src/lib/valid_data/addFriend";


export async function POST(req: Request) {
try {
    const body = await req.json();

    const {email : emailToAdd} = addFriendValidate.parse(body.email)

} catch (error) {
    
}    

}