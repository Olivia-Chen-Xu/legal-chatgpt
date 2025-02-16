"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, MailPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/lib/firebase/firebase-admin/firebase";
import { errorResponse } from "@/lib/utils";
import { useGlobalContext } from "@/app/store/global-context";
import { getDatabase, ref, child, get } from "firebase/database";
import { z } from "zod";
import Image from "next/image";
import { doc, setDoc } from "firebase/firestore";
import Container from "@/components/ui/Container";
import PageTitle from "@/components/ui/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signupSchema } from "@/app/features/sign-up/models/schema";
import { userSchema } from "@/app/features/chat/models/schema";
import InputFormField from "@/components/auth/input-form-field";

export default function Page() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { user, setUser, isLoading } = useGlobalContext();
  const [alert, setAlert] = useState("");
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const router = useRouter();
  const form = useForm<Zod.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    reValidateMode: "onSubmit",
  });

  /**
   *
   * @param data
   */
  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    try {
      const validData = signupSchema.parse(data);
      // const response = await readWhitelistEmails();

      createUser(validData.email, validData.password);
    } catch (error: unknown) {
      setAlert(errorResponse(error));
    }
  };

  /**
   *
   * @param email
   * @param password
   */
  const createUser = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // await sendEmailVerification(userCredential.user);

      // Adding user to list of valid users
      const validData = userSchema.parse({
        email,
        prompts_allowed: 100,
        prompts_left: 100,
        role: "default",
        verified: true,
      });
      await setDoc(doc(db, "users", userCredential.user.uid), validData);

      const user = userCredential.user;
      setUser(user);

      // setShowVerifyEmail(true);
    } catch (error: unknown) {
      setAlert(errorResponse(error));
    }
  };

  if (showVerifyEmail)
    return (
      <Container className="w-full h-[calc(100%-50px-75px)] flex justify-center items-start">
        <Card className="bg-inherit shadow-none border-0 mt-[100px]">
          <CardHeader className="text-center flex flex-col items-center">
            <MailPlus className="w-10 h-10" />
            <CardTitle className="text-[2rem]">Check your email</CardTitle>
            <CardDescription>
              A verification link has been sent to <b>{user?.email ?? ""}.</b>{" "}
              Verify your email before logging in.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Button
              variant={"default"}
              className="bg-primaryHue hover:bg-primaryHue/90 text-lg px-10 py-5"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    );

  return (
    <Container className="w-full h-[calc(100%-50px-75px)]">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleSignup)}
          className="h-full flex justify-center"
        >
          <div className="w-full max-w-[460px] flex flex-col justify-start mt-[100px] gap-5">
            <PageTitle className="text-center font-bold heading">
              Sign Up
            </PageTitle>

            {/* Email */}
            <InputFormField
              form={form}
              name="email"
              type="email"
              placeholder="Email"
              label="Email"
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Password</FormLabel>
                  <div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="ring-0 focus:ring-0 pr-[2.5rem] h-[50px]"
                          placeholder="Password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        {showPassword ? (
                          <button
                            type="button"
                            className="absolute right-[1rem] top-[50%] translate-y-[-50%]"
                            onClick={() => setShowPassword(false)}
                          >
                            <EyeOff className="w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="absolute right-[1rem] top-[50%] translate-y-[-50%]"
                            onClick={() => setShowPassword(true)}
                          >
                            <Eye className="w-4" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-1">
              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Confirm Password</FormLabel>
                    <div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="ring-0 focus:ring-0 pr-[2.5rem] h-[50px]"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="bg-primaryHue hover:bg-primaryHue/90 disabled:opacity-[0.6]"
              disabled={isLoading}
            >
              Sign Up
            </Button>

            <Label className="text-center">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="underline font-bold hover:opacity-[0.8]"
              >
                Log In
              </Link>
            </Label>
          </div>

          {/* Info Alert */}
          <AlertDialog open={!!alert}>
            <AlertDialogTitle className="hidden"></AlertDialogTitle>
            <AlertDialogContent
              onOpenAutoFocus={(e: any) => e.preventDefault()}
            >
              <AlertDialogDescription className="text-base text-[black]">
                {alert}
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => setAlert("")}
                  className="bg-primaryHue hover:bg-primaryHue/90"
                >
                  Okay
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </Container>
  );
}
