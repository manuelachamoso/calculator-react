import React, { useState } from 'react'
import Wrapper from './components/wrapper/Wrapper'
import Screen from './components/screen/Screen'
import ButtonBox from './components/buttonBox/ButtonBox'
import Button from './components/button/Button'

const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="]
]

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");
const deleteSpaces = (num) => num.toString().replace(/\s/g, "");

const App = () => {
  let [calculate, setCalculate] = useState({
    sign: '',
    num: 0,
    res: 0,
  })

  const deleteAll = () => {
    // Clear all

    setCalculate({
      ...calculate,
      sign:'',
      num: 0,
      res: 0,
    })
  }

  const invertClickHandler = () => {
    //Change + / -

    setCalculate({
      ...calculate,
      num: calculate.num ? toLocaleString(deleteSpaces(calculate.num) * -1) : 0,
      res: calculate.res ? toLocaleString(deleteSpaces(calculate.res) * -1) : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let num = calculate.num ? parseFloat(deleteSpaces(calculate.num)) : 0;
    let res = calculate.res ? parseFloat(deleteSpaces(calculate.res)) : 0;
    
    setCalculate({
      ...calculate,
      num: (num /= Math.pow(100,1)),
      res: (res /= Math.pow(100,1)),
      sign: '',
    })
  }

  const equalsClickHandler = () => {
    if (calculate.sign && calculate.num) {
      const math = (a, b, sign) => 
        sign === '+' ? a + b 
        : sign === '-'
        ? a - b 
        : sign === 'X'
        ? a * b 
        : a / b;

        setCalculate({
          ...calculate,
          res: calculate.num === '0' && calculate.sign === '/'
          ? "There's no way to divide a number by zero"
          : toLocaleString(math(Number(deleteSpaces(calculate.res)), Number(deleteSpaces(calculate.num)), calculate.sign)),
          sign: '',
          num: 0,
        })
    }
  }

  const signClickHandler = (e) => {
    e.preventDefault()
    const value = e.target.innerHTML;

    setCalculate({
      ...calculate,
      sign: value,
      res: !calculate.res && calculate.num ? calculate.num : calculate.res,
      num: 0,
    })
  }
  
  const pointClickHandler = (e) => {
    // It makes sure that no multiple decimal points are possible
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalculate({
      ...calculate,
      num: !calculate.num.toString().includes('.') ? calculate.num + value : calculate.num
    });
  }

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (deleteSpaces(calculate.num).length < 16) {
      setCalculate({
        ...calculate,
        num:
          calculate.num === 0 && value === "0"
            ? "0"
            : deleteSpaces(calculate.num) % 1 === 0
            ? toLocaleString(Number(deleteSpaces(calculate.num + value)))
            : toLocaleString(calculate.num + value),
        res: !calculate.sign ? 0 : calculate.res,
      });
    }
  };

  return (
    <div>
      <Wrapper>
      <Screen value={calculate.num ? calculate.num : calculate.res} />
      <ButtonBox>
        {btnValues.flat().map((btn, index) => {
          return (
            <Button
              key={index}
              className={btn === "=" ? "equals" : ""}
              value={btn}
              onClick={
                btn === "C"
                  ? deleteAll
                  : btn === "+-"
                  ? invertClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                  ? signClickHandler
                  : btn === "."
                  ? pointClickHandler
                  : numClickHandler
              }
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
    </div>
  )
}

export default App
