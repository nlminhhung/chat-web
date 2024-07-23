"use client";
import { addFriendValidate } from "@/src/lib/valid_data/addFriend";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";

import { Label } from "@/src/components/chat/(add a friend)/ui/label";
import { Input } from "@/src/components/chat/(add a friend)/ui/input";
import { Textarea } from "@/src/components/chat/(add a friend)/ui/textarea";
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

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidate.parse({ email });
      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      setSuccess(true);
    } catch (error) {
        if (error instanceof z.ZodError) {
          setError("email", { message: error.message });
          return;
        }
        if (error instanceof AxiosError) {
          setError("email", { message: error.response?.data });
          return;
        }
        setError("email", { message: "Something went wrong." });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <p></p>
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
            {...register('email')}
            id="email"
            type="email"
            placeholder="Enter your friend's email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea id="message" placeholder="Hey! Let's be friend!" />
        </div>
        <Button type="submit" className="w-full">
          Send Friend Request
        </Button>
      </form>
    </div>
  );
}
