"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" role="img" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleAuth = async (action: 'signUp' | 'signIn', values: any) => {
    setLoading(true);
    try {
      const authFn = action === 'signUp' ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
      await authFn(auth, values.email, values.password);
      router.push("/dashboard");
      toast({ title: action === 'signUp' ? "Account created successfully!" : "Signed in successfully!", description: "Redirecting to your dashboard..." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        router.push("/dashboard");
        toast({ title: "Signed in successfully with Google!", description: "Redirecting to your dashboard..." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Google sign-in failed", description: error.message });
    } finally {
        setGoogleLoading(false);
    }
  }

  return (
    <div className="container flex items-center justify-center py-12">
      <Tabs defaultValue="sign-in" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Access your dashboard to manage your submissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit((values) => handleAuth('signIn', values))} className="space-y-4">
                  <FormField control={signInForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="m@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signInForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </Form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading}>
                {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sign-up">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create an account to start your due diligence process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit((values) => handleAuth('signUp', values))} className="space-y-4">
                  <FormField control={signUpForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="m@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
                </form>
              </Form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading}>
                {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
