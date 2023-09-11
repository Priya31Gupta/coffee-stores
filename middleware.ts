import { NextResponse } from 'next/server';
 
// This function can be marked `async` if using `await` inside
export function middleware(req:any) {
    console.log("hi",req)
    return NextResponse.next();
}
 