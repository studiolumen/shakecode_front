"use client";

import { useState } from "react";

import CodeTester from "@/app/psadder/components/code-tester";
import PSAdder from "@/app/psadder/components/ps-adder";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/psadder/components/ui/tabs";

export default function ProblemManagementSystem() {
  const [activeTab, setActiveTab] = useState("tester");

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger
              value="tester"
              className="text-lg py-3 data-[state=active]:bg-gray-900">
              테케 검사기
            </TabsTrigger>
            <TabsTrigger
              value="adder"
              className="text-lg py-3 data-[state=active]:bg-gray-900">
              문제 추가기
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tester">
            <CodeTester />
          </TabsContent>
          <TabsContent value="adder">
            <PSAdder />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
