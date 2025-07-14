import { useEffect, useState, type JSX } from 'react'
import { DarkSelect, LogoGame } from "./components/components"
import Markdown from 'react-markdown'
import './App.css'
import './style/style.css'

function App() {
    const [selectGame, setSelectGame] = useState<{value: string, label: string, id: number}[]>([]);
    const [ports, setPorts] = useState<[string, number][]>([])
    const [logoGames, setLogoGames] = useState<JSX.Element>(<></>)
    const [selectedGame, setSelectedGame] = useState<number>(-1);
    const [res, setRes] = useState<JSX.Element>(<></>);
    const [selectedIp, setSelectedIp] = useState<string>("");
    const [selectedPort, setSelectedPort] = useState<number>(-1);

    useEffect(() => {
        let temp0: [string, number][] = [];
        let temp1: {value: string, label: string, id: number}[] = [];
        let temp2: string[] = [];
        fetch("https://servers-browser.vercel.app/api/games")
            .then((response) => response.json())
            .then((data) => {
                Object.keys(data).forEach((el, index) => {
                    temp0.push([el, data[el].options.port ?? data[el].options.port_query]);
                    temp1.push({value: el, label: data[el].name, id: index});
                    temp2.push(data[el].name);
                })
                setPorts(temp0);
                setSelectGame(temp1);
                for (let i = temp2.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [temp2[i], temp2[j]] = [temp2[j], temp2[i]];
                }
                setLogoGames(<><LogoGame option={temp2} /></>);
            })
            .catch((err) => console.log(err))
    }, [])

    function outData(ip: string, port: number){
        if (selectedGame !== -1 && 
            /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/
            .test(ip)) {
            // let status: boolean = false;
            fetch(`https://servers-browser.vercel.app/api?game=${selectGame[selectedGame].value}&ip=${ip}&port=${port}`)
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error('Server error');
                    }
                })
                .then((newData) => {
                    setRes(<>
                        <p>{`Name: ${newData.name}`}</p>
                    </>);
                });
        }
    }

  return (
    <>
      <div className="content">
        <header>
            <div className="head">
                <h1>Game Servers Database</h1>
                {logoGames}
            </div>
        </header>
        <div className="middle">
            <div className="serverPing">
                <div className="input">
                    <DarkSelect options={selectGame} onChange={(el) => setSelectedGame(el ? el.id : selectedGame)} placeholder="Game"/>
                    <input type="text" value={selectedIp} onChange={(el) => {setSelectedIp(el.target.value)}} placeholder="IP (e.g. 127.0.0.1)" />
                    <input type="text" value={selectedPort == -1 ? "" : selectedPort} onChange={(el) => {/^0x[0-9a-fA-F]{1,4}$/.test("0x" + parseInt(el.target.value.replace(/\D/g, ""), 10).toString(16)) ? setSelectedPort(Number(el.target.value.replace(/\D/g, ""))) : el.target.value == "" ? setSelectedPort(-1) : undefined}} placeholder={`PORT (e.g. ${selectedGame == -1 ? "27015" : ports[selectedGame][1]})`} />
                    <button onClick={() => {outData(selectedIp, selectedPort == -1 ? ports[selectedGame][1] : selectedPort)}}>Get info</button>
                </div>
                <div className="out">
                    {res}
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default App
