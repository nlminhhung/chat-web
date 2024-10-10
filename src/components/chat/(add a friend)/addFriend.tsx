"use client";
import { addFriendValidate } from "@/src/lib/valid_data/addFriend";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Label } from "@/src/components/chat/ui/label";
import { Input } from "@/src/components/chat/ui/input";
import { Button } from "@/src/components/chat/ui/button";
import { Textarea } from "@/src/components/chat/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/chat/ui/card";
import { UserPlus, ArrowLeft } from "lucide-react";
import socket from "@/src/lib/getSocket";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof addFriendValidate>;

export function AddFriend() {
  const [checkSuccess, setSuccess] = useState(false);
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(addFriendValidate) });

  const addFriend = async (email: string, message: string) => {
    try {
      const validatedRequest = addFriendValidate.parse({ email, message });
      const res = await fetch("/api/friends/add", {
        method: "post",
        body: JSON.stringify({
          email: validatedRequest.email,
          message: validatedRequest.message,
        }),
      });
      const resMessage = await res.json();
      if (!res.ok) {
        toast.error(resMessage.error);
      } else {
        socket.emit("newFriendRequest", { idToAdd: resMessage.idToAdd });
        setSuccess(true);
        toast.success("Your request has been filed!");
      }
    } catch (error) {
      toast.error("There was an error! Try again");
    }
  };
  const onSubmit = (data: FormData) => {
    addFriend(data.email, data.message);
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-800">
            Add a Friend
          </CardTitle>
          <CardDescription>
            Send a friend request to connect with someone new
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Friend's Email</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter your friend's email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                {...register("message")}
                id="message"
                placeholder="Add a personal message to your request"
                rows={4}
              />
            </div>
          </CardContent>
          {!checkSuccess ? (
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Send Friend Request
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-100"
                onClick={()=>router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </CardFooter>
          ) : null}
        </form>
      </Card>
    </div>
  );
}
