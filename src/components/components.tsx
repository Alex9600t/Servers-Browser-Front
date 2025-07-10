import { useEffect, useState } from 'react';
import Select, { type StylesConfig } from 'react-select'

const darkStyles: StylesConfig = {
  control: (base) => ({ ...base, background: '#2c2f33', borderColor: '#23272a', color: '#fff' }),
  menu: (base) => ({ ...base, background: '#2c2f33' }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? '#7289da' : state.isFocused ? '#23272a' : '#2c2f33',
    color: '#fff',
  }),
  singleValue: (base) => ({ ...base, color: '#fff' }),
  input: (base) => ({ ...base, color: '#fff' }),
  placeholder: (base) => ({ ...base, color: '#aaa' }),
}

type DarkSelectProps = {
  options: {value: string, label: string, id: number}[];
  onChange: (event: any) => void;
  placeholder?: string;
};

export function DarkSelect({options, onChange, placeholder}: DarkSelectProps) {
    return(<><Select styles={darkStyles} options={options} onChange={onChange} placeholder={placeholder}/></>)
}

type LogoGameProps = {
  option: string[];
};

export function LogoGame({option}: LogoGameProps) {
    const [name, setName] = useState<string>("");
    const [cursor, setCursor] = useState<boolean>(false);

    // My original code -> https://github.com/wh1teheaven1337wat/Homiverse/blob/main/js/text.js

    async function writeText(txt: string) {
        let current = '';
        setCursor(true);
        for (const char of txt) {
            current += char;
            setName(current);
            await new Promise(resolve => setTimeout(resolve, 195));
        }
    }
    async function deleteText(txt: string) {
        let current = txt;
        setCursor(true);
        while (current.length > 0) {
            current = current.slice(0, -1);
            setName(current);
            if (current.length !== 0) await new Promise(resolve => setTimeout(resolve, 95));
        }
    }

    async function animateText(arr: string[]) {
        let arrIndex = 0;
        while (true) {
            await writeText(arr[arrIndex]);
            let cursorVisible = true;
            let blinkInterval = setInterval(() => {
                cursorVisible = !cursorVisible;
                setCursor(cursorVisible);
            }, 500);
            await new Promise(resolve => setTimeout(resolve, 2000));
            clearInterval(blinkInterval);
            await deleteText(arr[arrIndex]);
            cursorVisible = !cursorVisible;
            blinkInterval = setInterval(() => {
                cursorVisible = !cursorVisible;
                setCursor(cursorVisible);
            }, 500);
            await new Promise(resolve => setTimeout(resolve, 2000));
            clearInterval(blinkInterval);
            
            if (arrIndex === arr.length - 1) {
                arrIndex = 0;
            } else {
                arrIndex++;
            }
        }
    }

    useEffect(() => {
        animateText(option);
    }, [])

    return(<><h1 className="logoGameName">{name}<span className="logoGameCursor">{cursor ? "|" : <>&nbsp;</>}</span></h1></>)
}