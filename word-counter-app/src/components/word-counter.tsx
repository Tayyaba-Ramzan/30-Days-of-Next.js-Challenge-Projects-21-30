"use client";
import React, { useState, ChangeEvent } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function WordCounter() {
    const [text, setText] = useState<string>("");

    const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const clearText = () => {
        setText("");
    };

    const wordCount = text
        .trim()
        .split(/\s+/)
        .filter((word) => word).length;

    const charCount = text.length;

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <Card className="w-[90%] max-w-md bg-transparent border-slate-800">
                <CardHeader className="text-center justify-center flex flex-col">
                    <h1 className="italic text-3xl font-bold">Word Counter</h1>
                    <CardTitle className="underline">Text Analysis</CardTitle>
                    <CardDescription>
                        Enter text and see the word and character count.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        id="text-input"
                        placeholder="Enter your text here..."
                        className="h-32 resize-none bg-slate-50"
                        value={text}
                        onChange={handleTextChange}
                    />
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            <span id="word-count">{wordCount}</span> words,{" "}
                            <span id="char-count">{charCount}</span> characters
                        </div>
                        <Button onClick={clearText}>Clear</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}