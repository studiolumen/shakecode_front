"use client";
import markdownIt from "markdown-it";
import markdownItMathjax from "markdown-it-mathjax3";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import LoadProblem from "@/app/psadder/LoadProblem";
import { Ranks, Testcase } from "@/app/psadder/type";
import {
  createProblem,
  getProblem,
  updateProblem,
} from "@/lib/api/problem.api";
import SessionChecker from "@/lib/util/sessionChecker";

import "./style.css";

const PSAdder = () => {
  const preview = useRef<HTMLDivElement>(null);
  const previewNotice = useRef<HTMLDivElement>(null);

  const [isSaved, setIsSaved] = useState(true);
  const [loadProblemPage, setLoadProblemPage] = useState(false);

  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [memory_limit, setMemory_limit] = useState<number>(0);
  const [time_limit, setTime_limit] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [testcases, setTestcases] = useState<Testcase[]>([]);

  function updatePreview() {
    const md = markdownIt({ html: true, breaks: true }).use(markdownItMathjax);

    if (preview.current && previewNotice.current) {
      preview.current.innerHTML = "";
      preview.current.innerHTML +=
        title || difficulty
          ? md.render(`# ${Ranks[difficulty] || difficulty}: ${title}`)
          : "";
      preview.current.innerHTML +=
        memory_limit && time_limit
          ? md.render(
              `- 메모리 제한: ${memory_limit}MB\n- 시간 제한: ${time_limit}ms`,
            )
          : "";
      preview.current.innerHTML += "<hr />";
      preview.current.innerHTML += md.render(description);
      preview.current.innerHTML += "<hr />";

      testcases.forEach((testcase: Testcase, index: number) => {
        if (testcase.input && testcase.output && preview.current) {
          preview.current.innerHTML += `<strong>입력 ${
            index + 1
          }</strong><div style="background-color: gray;"><code>${md.render(
            testcase.input,
          )}</code></div><strong>출력 ${
            index + 1
          }</strong><br><div style="background-color: gray"><code>${md.render(
            testcase.output,
          )}</code></div><br>`;
        }
      });

      if (preview.current.innerText.trim())
        previewNotice.current.style.display = "none";
      else previewNotice.current.style.display = "block";
    }
  }

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
    toast
      .promise(
        createProblem({
          name: title,
          difficulty,
          description,
          memory_limit,
          time_limit,
          category,
          testcases,
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
      })
      .catch((e) => {
        toast(e.response.data.message);
      });
  };

  const update = () => {
    toast
      .promise(
        updateProblem({
          id: parseInt(id),
          name: title,
          difficulty,
          description,
          memory_limit,
          time_limit,
          category,
          testcases,
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
      })
      .catch((e) => {
        toast(e.response.data.message);
      });
  };

  const load = () => {
    setLoadProblemPage(true);
  };

  useEffect(() => {
    if (
      parseInt(id) &&
      (isSaved ||
        (!isSaved &&
          confirm("수정사항을 무시하고 새로운 문제를 불러오시겠습니까?")))
    ) {
      toast
        .promise(getProblem(parseInt(id)), {
          pending: "불러오는 중...",
          success: "불러오기 성공",
          error: "불러오기 실패",
        })
        .then((problem) => {
          setTitle(problem.name);
          setDifficulty(problem.difficulty);
          setDescription(problem.description);
          setMemory_limit(problem.memory_limit);
          setTime_limit(problem.time_limit);
          setCategory(problem.category);
          setTestcases(problem.testCases);
        });
    }
  }, [id]);

  useEffect(() => {
    updatePreview();
  }, [title, difficulty, description, memory_limit, time_limit, testcases]);

  useEffect(() => {
    SessionChecker();
  }, []);

  return (
    <>
      <div className={"container"}>
        <h1>AL PS 문제 추가기</h1>
        <label>문제 번호</label>
        <textarea
          id="id"
          rows={1}
          value={id}
          onInput={(e) =>
            setId((e.target as HTMLTextAreaElement).value)
          }></textarea>
        <label>문제 제목</label>
        <textarea
          id="title"
          rows={1}
          value={title}
          onInput={(e) =>
            setTitle((e.target as HTMLTextAreaElement).value)
          }></textarea>
        <label>문제 난이도</label>
        <textarea
          id="difficulty"
          rows={1}
          placeholder="0~40"
          value={difficulty}
          onInput={(e) =>
            setDifficulty(
              parseInt((e.target as HTMLTextAreaElement).value) || 0,
            )
          }></textarea>
        <label>문제 본문 내용</label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onInput={(e) =>
            setDescription((e.target as HTMLTextAreaElement).value)
          }></textarea>
        <label>사용자에게 보여줄 테스트케이스</label>
        <div id="exampleCases">
          {testcases.map((tc, index) =>
            tc.show_user ? (
              <div className="test-case-group" key={index}>
                <textarea
                  placeholder="입력"
                  rows={2}
                  value={tc.input}
                  onChange={(e) => setTestcaseInput(index, e.target.value)}
                  className="exampleCaseInput"></textarea>
                <textarea
                  placeholder="출력"
                  rows={2}
                  value={tc.output}
                  onChange={(e) => setTestcaseOutput(index, e.target.value)}
                  className="exampleCaseOutput"></textarea>
                <button onClick={() => removeTestcase(index)}>X</button>
              </div>
            ) : null,
          )}
        </div>
        <button
          onClick={addExampleCase}
          style={{ display: "block", marginBottom: "10px" }}>
          테스트케이스 추가
        </button>
        <label style={{ display: "block", marginTop: "10px" }}>
          안보여주는 테스트케이스
        </label>
        <div id="hiddenCases">
          {testcases.map((tc, index) =>
            !tc.show_user ? (
              <div className="test-case-group" key={index}>
                <textarea
                  placeholder="입력"
                  rows={2}
                  value={tc.input}
                  onChange={(e) => setTestcaseInput(index, e.target.value)}
                  className="hiddenCaseInput"></textarea>
                <textarea
                  placeholder="출력"
                  rows={2}
                  value={tc.output}
                  onChange={(e) => setTestcaseOutput(index, e.target.value)}
                  className="hiddenCaseOutput"></textarea>
                <button onClick={() => removeTestcase(index)}>X</button>
              </div>
            ) : null,
          )}
        </div>
        <button
          onClick={addHiddenCase}
          style={{ display: "block", marginBottom: "10px" }}>
          테스트케이스 추가
        </button>
        <label>메모리 제한</label>
        <textarea
          id="memoryLimit"
          rows={1}
          value={memory_limit}
          onInput={(e) =>
            setMemory_limit(
              parseInt((e.target as HTMLTextAreaElement).value) || 0,
            )
          }></textarea>
        <label>시간 제한</label>
        <textarea
          id="timeLimit"
          rows={1}
          value={time_limit}
          onInput={(e) =>
            setTime_limit(
              parseInt((e.target as HTMLTextAreaElement).value) || 0,
            )
          }></textarea>
        <label>분류 (알고리즘)</label>
        <textarea
          id="category"
          rows={1}
          value={category}
          onInput={(e) =>
            setCategory((e.target as HTMLTextAreaElement).value)
          }></textarea>
        <button onClick={save}>저장</button>
        <button onClick={update}>수정</button>
        <button onClick={load}>불러오기</button>
      </div>
      <div className={"container"}>
        <h1 ref={previewNotice}>본문 미리보기</h1>
        <div ref={preview} className="preview"></div>
      </div>
      <LoadProblem
        loadProblemPage={loadProblemPage}
        setLoadProblemPage={setLoadProblemPage}
        setProblemId={setId}
      />
    </>
  );
};

export default PSAdder;
