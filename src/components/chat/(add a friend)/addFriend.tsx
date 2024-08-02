"use client";
import { addFriendValidate } from "@/src/lib/valid_data/addFriend";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Label } from "@/src/components/chat/(add a friend)/ui/label";
import { Input } from "@/src/components/chat/(add a friend)/ui/input";
import { Button } from "@/src/components/chat/(add a friend)/ui/button";

type FormData = z.infer<typeof addFriendValidate>;

export function AddFriend() {
  const [checkSuccess, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(addFriendValidate) });

  const addFriend = async (email: string, message: string) => {
    try {
      const validatedRequest = addFriendValidate.parse({ email, message });
      await axios.post("/api/friends/add", {
        email: validatedRequest.email,
        message: validatedRequest.message,
      });

      setSuccess(true);
      toast.success("Your request has been filed!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
        return;
      }
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("here:", data.email, data.message);
    addFriend(data.email, data.message);
  };

  return (
    <div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Add a Friend</h1>
        <p className="text-muted-foreground">
          Enter your friend's email address to send them a friend request.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Enter your friend's email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Input
            {...register("message")}
            id="message"
            placeholder="Hey! Let's be friend!"
          />
        </div>
        {!checkSuccess ? (
          <Button type="submit" className="w-full">
            Send Friend Request
          </Button>
        ) : null}
      </form>
    </div>
  );
}
