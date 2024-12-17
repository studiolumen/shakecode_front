"use client";

import { Dispatch, DragEvent, SetStateAction, useEffect, useRef } from "react";

import { Testcase, TestcaseGroup } from "@/app/psadder/type";

const DropZone = ({
  setTestcases,
}: {
  setTestcases: Dispatch<SetStateAction<Testcase[]>>;
}) => {
  const frame = useRef<HTMLDivElement>(null);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!frame.current) return;
    e.preventDefault();

    frame.current.style.opacity = "0.8";
  };

  const onDrop = (e: DragEvent) => {
    if (!frame.current) return;
    e.preventDefault();
    resetDragBox();

    const files = Array.prototype.map
      .call(e.dataTransfer.items, (file) => file.webkitGetAsEntry())
      .filter((file: any) => file.isDirectory)
      .map((file: any) => file.createReader());

    // load
    // TODO: optimize
    const loadTests = new Promise<File[]>((resolve, reject) => {
      // search for tests directory
      files.forEach((file) => {
        file.readEntries((entries: FileSystemEntry[]) => {
          const poligonEntry: any = entries.find(
            (entry) => entry.name.indexOf("tests") !== -1,
          );
          if (poligonEntry) {
            // extract testcase file entry from directory
            const tests: FileSystemEntry[] = [];
            const reader = poligonEntry.createReader();
            const readEntriesRecursively = (
              reader: FileSystemDirectoryReader,
            ) => {
              reader.readEntries((testcases: FileSystemEntry[]) => {
                if (testcases.length === 0) {
                  const testFiles: File[] = [];
                  // extract file from file entry
                  tests.forEach((test) => {
                    (test as FileSystemFileEntry).file((testFile) => {
                      testFiles.push(testFile);

                      if (testFiles.length === tests.length) {
                        const sorted = testFiles.sort(
                          (a, b) =>
                            parseInt(a.name.split(".")[0]) -
                            parseInt(b.name.split(".")[0]),
                        );
                        resolve(sorted);
                      }
                    });
                  });
                  return;
                }
                tests.push(...testcases);
                readEntriesRecursively(reader);
              });
            };
            readEntriesRecursively(reader);
          } else {
            const tests: FileSystemEntry[] = [];
            const readEntriesRecursively = (
              reader: FileSystemDirectoryReader,
              testcases1: FileSystemEntry[],
            ) => {
              testcases1
                .filter((fe) => !fe.isFile)
                .forEach((fe) => {
                  readEntriesRecursively(
                    (fe as FileSystemDirectoryEntry).createReader(),
                    [],
                  );
                });
              tests.push(...testcases1.filter((fe) => fe.isFile));
              reader.readEntries((testcases2: FileSystemEntry[]) => {
                if (testcases2.length === 0) {
                  const testFiles: File[] = [];
                  // extract file from file entry
                  tests.forEach((test) => {
                    (test as FileSystemFileEntry).file((testFile) => {
                      testFiles.push(testFile);

                      if (testFiles.length === tests.length) {
                        const sorted = testFiles
                          .filter((tf) => !tf.name.startsWith("."))
                          .sort(
                            (a, b) =>
                              parseInt(
                                a.name.split(".")[0].replaceAll(/[^0-9]/g, ""),
                              ) -
                              parseInt(
                                b.name.split(".")[0].replaceAll(/[^0-9]/g, ""),
                              ),
                          );
                        console.log(sorted);
                        resolve(sorted);
                      }
                    });
                  });
                  return;
                }
                readEntriesRecursively(reader, testcases2);
              });
            };
            readEntriesRecursively(file, entries);
          }
        });
      });
    });

    // grouping
    const groupTests = new Promise<TestcaseGroup>((resolve, reject) => {
      let loop = 0;
      const group: TestcaseGroup = {};
      loadTests.then((tests: File[]) => {
        tests.forEach(async (test) => {
          const id = parseInt(
            test.name.split(".")[0].replaceAll(/[^0-9]/g, ""),
          );
          const isOutput =
            test.name.split(".")[1] === "a" ||
            test.name.split(".")[1] === "out";
          if (!group[id]) group[id] = { input: "", output: "" };
          group[id][isOutput ? "output" : "input"] = (await test.text())
            .replaceAll("\r\n", "\n") // CRLF to LF
            .replaceAll("\u0000", ""); // null byte removal
          loop++;
          if (loop === tests.length) resolve(group);
        });
      });
    });

    groupTests.then((group) => {
      const testcases: Testcase[] = [];
      Object.entries(group).forEach(([id, testcase], index) => {
        testcases.push({
          input: testcase.input,
          output: testcase.output,
          show_user: false,
        });
        if (index === Object.keys(group).length - 1) setTestcases(testcases);
      });
    });
  };

  const resetDragBox = () => {
    if (!frame.current) return;
    frame.current.style.opacity = "0";
    frame.current.style.pointerEvents = "none";
  };

  useEffect(() => {
    window.ondragover = () => {
      if (!frame.current) return;
      frame.current.style.pointerEvents = "auto";
    };
  }, []);

  return (
    <>
      <div
        ref={frame}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          margin: "20px",
          border: "6px solid #FFF",
          borderRadius: "10px",
          backgroundColor: "#EEE",

          color: "#000",
          fontSize: "24px",

          pointerEvents: "none",
          opacity: 0,
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragExit={() => resetDragBox()}
        onDragLeave={() => resetDragBox()}>
        여기에 드롭
      </div>
    </>
  );
};

export default DropZone;
