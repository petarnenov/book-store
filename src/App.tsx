import { useState } from 'react';
import './App.css';
import Result from './components/Result';

function App() {
  const [result, setResult] = useState("")
  const [str, setStr] = useState("")
  const [hasErr, setHasErr] = useState(false)

  const handleClickZip = () => {
    setHasErr(false)
    if (typeof str !== "string") {
      return setResult("arg is not a string")

    }
    if (str.length === 0) {
      return setResult(str)
    }

    let counter = 0
    let prevChar: string = str[0]
    let temp = ""
    str.split("").forEach((char, index) => {
      if (prevChar === char) {
        counter++
      } else {
        updateTemp()
        counter = 1
        prevChar = char

      }
    })
    updateTemp()
    function updateTemp() {
      temp += `${counter.toString()}"${prevChar}"`
    }
    setResult(temp)
  }

  const handleClickUnZip = () => {
    let stateMachine: "begin" | "counter" | "mark" | "char" | "unzip" = "begin"
    let repeatCounter:string = ""
    let repeatChar:string = result[0]
    let tempUnZip = ""
    try {
      if (!result.length) return

      result.split("").forEach(char => {
        if (stateMachine === "begin") {
          handleChangeToCounterState();
        }

        if (stateMachine === "counter" && isFinite(+char)) {
          handleCounterState();
          return
        }

        if (stateMachine === "counter" && char === '"') {
          handleChangeToMarkState();
          return
        }

        if (stateMachine === "mark") {
          handleMarkState();
          return
        }

        if (stateMachine === "char" && char === '"') {
          handleChangeToUnZipState();
        }

        if (stateMachine === "unzip") {
          handleUnZipState();
          return
        }


        function handleUnZipState() {
          tempUnZip += repeatChar.repeat(+repeatCounter);
          stateMachine = "begin";
        }

        function handleChangeToUnZipState() {
          stateMachine = "unzip";
        }

        function handleMarkState() {
          repeatChar = char;
          stateMachine = "char";
        }

        function handleChangeToMarkState() {
          stateMachine = "mark";
        }

        function handleCounterState() {
          repeatCounter += char;
        }

        function handleChangeToCounterState() {
          repeatCounter = "";
          stateMachine = "counter";
        }
      })

      if (repeatCounter === "") {
        throw Error("Wrong zip format")
      }

      setResult(tempUnZip)
    } catch (e: unknown) {
      setHasErr(true)
    }


  }

  return (
    <div className="App">
      <section>
        <label htmlFor="str">Enter string: </label>
        <input type="text" name="str" defaultValue={str} onChange={(e) => setStr(e.target.value)} />
        <button onClick={() => handleClickZip()}>Zip</button>
        <button onClick={() => handleClickUnZip()}>UnZip</button>
        <Result data={result} />
        {hasErr && <h3>Wrong zip format</h3>}
      </section>
    </div>
  );
}

export default App;
