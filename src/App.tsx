import { useState } from 'react';
import './App.css';
import Result from './components/Result';

function App() {
  const [result, setResult] = useState("")
  const [str, setStr] = useState("")
  const [hasErr, setHasErr] = useState(false)

  /* easy examine task */
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
    str.split("").forEach((char) => {
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
    let repeatCounter: string = ""
    let repeatChar: string = result[0]
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
  /* */

  /* Harder examine task , look at dev tools console*/
  type Person = { name: string; age: number }
  type InputObj = { func: Function, args: any, context: any }
  const store: Map<Symbol, InputObj> = new Map<Symbol, InputObj>();
  const saveFunc = (func: Function, context: any, ...args: any[]) => {
    const name = Symbol(`${func.name}:${args.toString()}`)
    store.set(name, { func, args, context })
    return name
  }
  const callFunc = (name: Symbol) => {
    const current = store.get(name)
    return current?.func.apply(current.context, current.args)
  }


  const f1 = (...args: any[]) => {
    return args
  }
  const f2 = (x: number, y: number): number => {
    return x + y
  }
  const f3 = (person: Person) => {
    return person
  }
  function f4(this: Person) {
    this.name += "Mutated"
    this.age += 100
    return this
  }


  const p1: Person = {
    name: "Peter",
    age: 50
  }

  const p2: Person = {
    name: "Joe",
    age: 77
  }

  const s21 = saveFunc(f2, null, 2, 3)
  const s22 = saveFunc(f2, null, 10, 12)
  const s31 = saveFunc(f3, null, { name: "Alf", age: 12 })
  saveFunc(f1, null, callFunc(s21), callFunc(s22))
  saveFunc(f1, null, callFunc(s31))
  saveFunc(f4, p1)
  saveFunc(f4, p2)

  store.forEach((o, key) => {
    console.log(`call ${key.toString()} -> result: `, callFunc(key))
  })
  /* */

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
