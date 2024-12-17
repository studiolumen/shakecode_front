"use client";

import {
  Save,
  Trash2,
  RefreshCw,
  Download,
  LogOut,
  Plus,
  Clock,
  MemoryStick,
} from "lucide-react";
import markdownIt from "markdown-it";
import markdownItMathjax from "markdown-it-mathjax3";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import DropZone from "@/app/psadder/components/DropZone";
import LoadProblem from "@/app/psadder/components/LoadProblem";
import { Button } from "@/app/psadder/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/psadder/components/ui/card";
import { Input } from "@/app/psadder/components/ui/input";
import { Textarea } from "@/app/psadder/components/ui/textarea";
import { Testcase } from "@/app/psadder/type";
import { ProblemApi, AuthApi } from "@/lib/api";
import SessionChecker from "@/lib/util/sessionChecker";

const PSAdder = () => {
  const preview = useRef<HTMLDivElement>(null);
  const previewNotice = useRef<HTMLDivElement>(null);

  const [isSaved, setIsSaved] = useState(true);
  const [loadProblemPage, setLoadProblemPage] = useState(false);

  const [id, setId] = useState<string>("");
  const [pid, setPid] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [memory_limit, setMemory_limit] = useState<number>(0);
  const [time_limit, setTime_limit] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [testcases, setTestcases] = useState<Testcase[]>([]);
  const [uploadTestcases, setUploadTestcases] = useState<Testcase[]>([]);
  const [testcaseCount, setTestcaseCount] = useState<number>(0);

  const updatePreview = () => {
    const md = markdownIt({ html: true, breaks: true }).use(markdownItMathjax);

    if (preview.current && previewNotice.current) {
      preview.current.innerHTML = md.render(description);

      if (preview.current.innerText.trim()) {
        previewNotice.current.style.display = "none";
      } else {
        previewNotice.current.style.display = "block";
        previewNotice.current.innerText = "문제 설명을 입력해주세요.";
      }
    }
  };

  const intermediateSave = () => {
    // const data: UpdateProblem = {
    //   id: id,
    //   pid: parseInt(pid),
    //   name,
    //   difficulty,
    //   description,
    //   memory_limit,
    //   time_limit,
    //   category,
    //   testcases,
    //   restricted: 0,
    // };
    // localStorage.setItem("intermediateSavedProblemData", JSON.stringify(data));

    setIsSaved(true);
  };

  const loadFromLocalStorage = () => {
    // const data = localStorage.getItem("intermediateSavedProblemData");
    // if (data) {
    //   const parsed = JSON.parse(data);
    //   setId(parsed.id);
    //   setPid(parsed.pid);
    //   setName(parsed.name);
    //   setDifficulty(parsed.difficulty);
    //   setDescription(parsed.description);
    //   setMemory_limit(parsed.memory_limit);
    //   setTime_limit(parsed.time_limit);
    //   setCategory(parsed.category);
    //   setTestcases(parsed.testcases);
    // }
  };

  const clearIntermediateSave = () => {
    localStorage.removeItem("intermediateSavedProblemData");
  };

  const addExampleCase = () => {
    const copy = testcases.slice();
    copy.push({ input: "", output: "", show_user: true });
    setTestcases(copy);
  };

  const addHiddenCase = () => {
    const copy = testcases.slice();
    copy.push({ input: "", output: "", show_user: false });
    setTestcases(copy);
  };

  const setTestcaseInput = (index: number, value: string) => {
    const copy = testcases.slice();
    copy[index].input = value;
    setTestcases(copy);
  };

  const setTestcaseOutput = (index: number, value: string) => {
    const copy = testcases.slice();
    copy[index].output = value;
    setTestcases(copy);
  };

  const removeTestcase = (index: number) => {
    const copy = testcases.slice();
    copy.splice(index, 1);
    setTestcases(copy);
  };

  const save = () => {
    intermediateSave();
    toast
      .promise(
        ProblemApi.create({
          name: name,
          difficulty,
          description,
          memory_limit,
          time_limit,
          category,
          testcases: testcases.concat(uploadTestcases),
          restricted: 0,
        }),
        {
          pending: "저장중입니다...",
          success: "저장에 성공하였습니다.",
          error: "저장에 실패하였습니다.",
        },
      )
      .then(() => {
        if (parseInt(pid)) update();
        setIsSaved(true);
        clearIntermediateSave();
      })
      .catch((e) => {
        toast(e.response.data.message);
      });
  };

  const update = () => {
    intermediateSave();
    toast
      .promise(
        ProblemApi.update({
          id: id,
          pid: parseInt(pid),
          name: name,
          difficulty,
          description,
          memory_limit,
          time_limit,
          category,
          testcases: testcases.concat(uploadTestcases),
          restricted: 0,
        }),
        {
          pending: "저장중입니다...",
          success: "저장에 성공하였습니다.",
          error: "저장에 실패하였습니다.",
        },
      )
      .then(() => {
        setIsSaved(true);
        clearIntermediateSave();
      })
      .catch((e) => {
        toast(e.response.data.message);
      });
  };

  const load = () => {
    setLoadProblemPage(true);
  };

  const del = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      toast
        .promise(ProblemApi.deleteProblem(id), {
          pending: "삭제중입니다...",
          success: "삭제에 성공하였습니다.",
          error: "삭제에 실패하였습니다.",
        })
        .then(() => {
          clearIntermediateSave();
          clear(true);
        });
    }
  };

  const clear = (noask?: boolean) => {
    if (noask || confirm("정말 초기화하시겠습니까?")) {
      setId("");
      setPid("");
      setName("");
      setDifficulty(0);
      setDescription("");
      setMemory_limit(0);
      setTime_limit(0);
      setCategory("");
      setTestcases([]);
      setIsSaved(true);
    }
  };

  useEffect(() => {
    if (
      id &&
      (isSaved ||
        (!isSaved &&
          confirm("수정사항을 무시하고 새로운 문제를 불러오시겠습니까?")))
    ) {
      toast
        .promise(ProblemApi.getFull(id), {
          pending: "불러오는 중...",
          success: "불러오기 성공",
          error: "불러오기 실패",
        })
        .then((problem) => {
          setPid(problem.pid);
          setName(problem.name);
          setDifficulty(problem.difficulty);
          setDescription(problem.description);
          setMemory_limit(problem.memory_limit);
          setTime_limit(problem.time_limit);
          setCategory(problem.category);
          setTestcases(problem.testCases);
          setTestcaseCount(problem.testcasesCount);
          setIsSaved(true);
        });
    }
  }, [id]);

  useEffect(() => {
    setIsSaved(false);
    updatePreview();
  }, [name, difficulty, description, memory_limit, time_limit, testcases]);

  useEffect(() => {
    setIsSaved(true);
    SessionChecker();

    if (localStorage.getItem("intermediateSavedProblemData")) {
      if (
        confirm(
          "임시 저장된 데이터가 있습니다. 불러오시겠습니까? (지금 불러오지 않으면 삭제됩니다.)",
        )
      ) {
        loadFromLocalStorage();
        clearIntermediateSave();
      } else clearIntermediateSave();
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full space-y-6 lg:space-y-0 lg:space-x-6">
      <Card className="w-full lg:w-1/2 bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-gray-300">
            <Plus className="w-6 h-6" />
            문제 추가기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="id"
              placeholder="전역 문제 번호 (수정 불가)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled
              className="bg-gray-800 text-gray-300 border-gray-700"
            />
            <Input
              id="pid"
              placeholder="PUBLIC 문제 번호"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
              className="bg-gray-800 text-gray-300 border-gray-700"
            />
          </div>
          <Input
            id="title"
            placeholder="문제 제목"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 text-gray-300 border-gray-700"
          />
          <Input
            id="difficulty"
            type="number"
            placeholder="문제 난이도 (0~40)"
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value) || 0)}
            className="bg-gray-800 text-gray-300 border-gray-700"
          />
          <Textarea
            id="description"
            placeholder="문제 본문 내용"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={15}
            className="bg-gray-800 text-gray-300 border-gray-700"
          />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">
              사용자에게 보여줄 테스트케이스
            </h3>
            {testcases.map((tc, index) =>
              tc.show_user ? (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 space-y-2">
                    <Textarea
                      placeholder="입력"
                      value={tc.input}
                      onChange={(e) => setTestcaseInput(index, e.target.value)}
                      rows={2}
                      className="bg-gray-700 text-gray-300 border-gray-700"
                    />
                    <Textarea
                      placeholder="출력"
                      value={tc.output}
                      onChange={(e) => setTestcaseOutput(index, e.target.value)}
                      rows={2}
                      className="bg-gray-700 text-gray-300 border-gray-700"
                    />
                    <Button
                      onClick={() => removeTestcase(index)}
                      variant="destructive"
                      size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </CardContent>
                </Card>
              ) : null,
            )}
            <Button
              onClick={addExampleCase}
              variant="outline"
              className="bg-gray-800 text-gray-300 border-gray-700">
              <Plus className="w-4 h-4 mr-2" />
              테스트케이스 추가
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">
              안보여주는 테스트케이스
            </h3>
            {testcases.map((tc, index) =>
              !tc.show_user ? (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 space-y-2">
                    <Textarea
                      placeholder="입력"
                      value={tc.input}
                      onChange={(e) => setTestcaseInput(index, e.target.value)}
                      rows={2}
                      className="bg-gray-700 text-gray-300 border-gray-700"
                    />
                    <Textarea
                      placeholder="출력"
                      value={tc.output}
                      onChange={(e) => setTestcaseOutput(index, e.target.value)}
                      rows={2}
                      className="bg-gray-700 text-gray-300 border-gray-700"
                    />
                    <Button
                      onClick={() => removeTestcase(index)}
                      variant="destructive"
                      size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </CardContent>
                </Card>
              ) : null,
            )}
            <Button
              onClick={addHiddenCase}
              variant="outline"
              className="bg-gray-800 text-gray-300 border-gray-700">
              <Plus className="w-4 h-4 mr-2" />
              테스트케이스 추가
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="memoryLimit"
              type="number"
              placeholder="메모리 제한 (MB)"
              value={memory_limit}
              onChange={(e) => setMemory_limit(parseInt(e.target.value) || 0)}
              className="bg-gray-800 text-gray-300 border-gray-700"
            />
            <Input
              id="timeLimit"
              type="number"
              placeholder="시간 제한 (ms)"
              value={time_limit}
              onChange={(e) => setTime_limit(parseInt(e.target.value) || 0)}
              className="bg-gray-800 text-gray-300 border-gray-700"
            />
          </div>
          <Input
            id="category"
            placeholder="분류 (알고리즘)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-800 text-gray-300 border-gray-700"
          />
          <div className="text-gray-300">
            테스트 케이스 {testcaseCount}개 로드됨.
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={save} className="bg-gray-700 hover:bg-gray-600">
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
            <Button onClick={update} className="bg-gray-700 hover:bg-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              수정
            </Button>
            <Button onClick={load} className="bg-gray-700 hover:bg-gray-600">
              <Download className="w-4 h-4 mr-2" />
              불러오기
            </Button>
            <Button
              onClick={del}
              variant="destructive"
              className="bg-gray-700 hover:bg-gray-600">
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
            <Button
              onClick={() => clear()}
              variant="destructive"
              className="bg-gray-700 hover:bg-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </div>
          <Button
            onClick={() => AuthApi.logout()}
            variant="outline"
            className="bg-gray-800 text-gray-300 border-gray-700">
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>

          <LoadProblem
            loadProblemPage={loadProblemPage}
            setLoadProblemPage={setLoadProblemPage}
            setProblemId={setId}
          />
          <DropZone setTestcases={setUploadTestcases} />
        </CardContent>
      </Card>

      <Card className="w-full lg:w-1/2 bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-300">
            본문 미리보기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            ref={previewNotice}
            className="text-xl font-bold mb-4 text-gray-300"></div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-gray-100">
              {name || "문제 제목"}
            </h1>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-300">
                  시간 제한: {time_limit || 0} ms
                </span>
              </div>
              <div className="flex items-center">
                <MemoryStick className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-300">
                  메모리 제한: {memory_limit || 0} MB
                </span>
              </div>
            </div>
            <div
              ref={preview}
              className="preview prose prose-invert max-w-none mb-8">
              {description || "문제 설명을 입력해주세요."}
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                예제 입출력
              </h2>
              {testcases
                .filter((tc) => tc.show_user)
                .map((tc, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                      예제 {index + 1}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">
                          입력:
                        </h4>
                        <pre className="bg-gray-800 p-2 rounded text-gray-300 whitespace-pre-wrap">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">
                          출력:
                        </h4>
                        <pre className="bg-gray-800 p-2 rounded text-gray-300 whitespace-pre-wrap">
                          {tc.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PSAdder;
