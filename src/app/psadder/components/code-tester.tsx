"use client";

import { AlertCircle, CheckCircle2, Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { Button } from "@/app/psadder/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/psadder/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/psadder/components/ui/select";
import { Textarea } from "@/app/psadder/components/ui/textarea";
import { ProblemApi } from "@/lib/api";

interface TestCase {
  input: string;
  output: string;
  real: string;
  result: boolean;
}

export default function CodeTester() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestCase[]>([]);
  const [error, setError] = useState("");
  const [problems, setProblems] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [selectedProblem, setSelectedProblem] = useState("");

  useEffect(() => {
    ProblemApi.getList()
      .then((data) => {
        setProblems(data);
        if (data.length > 0) {
          setSelectedProblem(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch problems:", err);
        setError(
          "문제 목록을 불러오는데 실패했습니다. 서버 상태를 확인해주세요.",
        );
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    toast
      .promise(ProblemApi.testCode(selectedProblem, language, code), {
        pending: "실행중입니다...",
        success: "실행이 완료되었습니다.",
        error: "실행이 실패하였습니다.",
      })
      .then((data) => {
        if (data.passed) toast.success("테스트에 성공하였습니다.");
        else toast.error("통과하지 못한 테스트케이스가 있습니다");
        setResults(
          data.testcases.map((tc: string[]) => {
            return {
              result: tc[1] === tc[2],
              input: tc[0],
              output: tc[1],
              real: tc[2],
            };
          }) || [],
        );
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "코드 테스트에 실패했습니다");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-gray-300">
          <Code2 className="w-6 h-6" />
          코드 테스터
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedProblem} onValueChange={setSelectedProblem}>
              <SelectTrigger className="bg-gray-800 text-gray-300 border-gray-600">
                <SelectValue placeholder="문제 선택" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-300 border-gray-600">
                {problems.map((problem) => (
                  <SelectItem key={problem.id} value={problem.id}>
                    {problem.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-gray-800 text-gray-300 border-gray-600">
                <SelectValue placeholder="컴파일러 선택" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-300 border-gray-600">
                <SelectItem value="gcc">C</SelectItem>
                <SelectItem value="gpp">C++</SelectItem>
                <SelectItem value="python">python3</SelectItem>
                <SelectItem value="node">node.js</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="여기에 코드를 붙여넣으세요..."
            className="font-mono min-h-[300px] bg-gray-800 text-gray-300 border-gray-600"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600">
            {loading ? "테스트 중..." : "코드 테스트"}
          </Button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-gray-800 text-red-100 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-300">테스트 결과</h3>
            {results.map((test, index) => (
              <Card
                key={index}
                className={`${
                  test.result ? "bg-gray-800" : "bg-gray-700"
                } border-gray-700`}>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div
                      className={`flex items-center gap-2 ${
                        test.result ? "text-green-100" : "text-red-100"
                      }`}>
                      {test.result ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      테스트 케이스 {index + 1}: {test.result ? "통과" : "실패"}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-semibold mb-2 text-gray-200">
                          입력:
                        </p>
                        <pre className="p-2 bg-gray-800 rounded-md whitespace-pre-wrap text-gray-300">
                          {test.input}
                        </pre>
                      </div>
                      <div>
                        <p className="font-semibold mb-2 text-gray-200">
                          예상 출력:
                        </p>
                        <pre className="p-2 bg-gray-800 rounded-md whitespace-pre-wrap text-gray-300">
                          {test.output}
                        </pre>
                      </div>
                      <div>
                        <p className="font-semibold mb-2 text-gray-200">
                          출력:
                        </p>
                        <pre className="p-2 bg-gray-800 rounded-md whitespace-pre-wrap text-gray-300">
                          {test.real}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="h-5 w-5" />
              {results.filter((test) => test.result).length}개의 테스트 케이스
              통과 / 총 {results.length}개
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
