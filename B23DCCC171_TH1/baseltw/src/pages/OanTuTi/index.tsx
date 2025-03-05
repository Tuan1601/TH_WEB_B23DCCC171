import React, { useState } from 'react';
import { Button, Card, message, Radio } from 'antd';
import './style.css';

const choices = [
    { name: 'Kéo', img: 'https://www.pinclipart.com/picdir/big/536-5360227_scissors-hand-rock-paper-scissors-png-clipart.png' },
    { name: 'Búa', img: 'https://www.pinclipart.com/picdir/big/559-5590543_rock-paper-scissors-png-clipart.png' },
    { name: 'Bao', img: 'https://www.pinclipart.com/picdir/big/51-511523_rock-paper-rock-paper-scissors-clipart-png-download.png' }
];

const getRandomChoice = () => choices[Math.floor(Math.random() * choices.length)].name;

const getResult = (player: string, computer: string) => {
    if (player === computer) return 'Hòa!';
    if (
        (player === 'Kéo' && computer === 'Bao') ||
        (player === 'Búa' && computer === 'Kéo') ||
        (player === 'Bao' && computer === 'Búa')
    ) {
        return 'Bạn thắng!';
    }
    return 'Bạn thua!';
};

const OanTuTi = () => {
    const [playerChoice, setPlayerChoice] = useState('');
    const [computerChoice, setComputerChoice] = useState('');
    const [result, setResult] = useState('');
    const [history, setHistory] = useState([]);
    const [gameMode, setGameMode] = useState(1);
    const [playerWins, setPlayerWins] = useState(0);
    const [computerWins, setComputerWins] = useState(0);
    const [winner, setWinner] = useState(null);

    const handleClick = (choice: React.SetStateAction<string>) => {
        if (winner) return;
        
        const computer = getRandomChoice();
        const gameResult = getResult(choice, computer);

        setPlayerChoice(choice);
        setComputerChoice(computer);
        setResult(gameResult);

        const newHistory = [...history, { player: choice, computer, result: gameResult }];
        setHistory(newHistory);

        let newPlayerWins = playerWins;
        let newComputerWins = computerWins;
        
        if (gameResult === 'Bạn thắng!') newPlayerWins++;
        if (gameResult === 'Bạn thua!') newComputerWins++;

        setPlayerWins(newPlayerWins);
        setComputerWins(newComputerWins);

        if (newPlayerWins === gameMode) {
            setWinner('Bạn đã chiến thắng!');
        } else if (newComputerWins === gameMode) {
            setWinner('Máy đã chiến thắng!');
        }
        
        message.info(gameResult);
    };

    const handleRestart = () => {
        setPlayerChoice('');
        setComputerChoice('');
        setResult('');
        setHistory([]);
        setPlayerWins(0);
        setComputerWins(0);
        setWinner(null);
    };

    return (
        <div className="game-container">
            <h1>Trò chơi Kéo Búa Bao</h1>
            <Radio.Group value={gameMode} onChange={(e) => { setGameMode(e.target.value); handleRestart(); }}>
                <Radio.Button className='type_game' value={1}>BO1</Radio.Button>
                <Radio.Button className='type_game' value={3}>BO3</Radio.Button>
                <Radio.Button className='type_game' value={5}>BO5</Radio.Button>
            </Radio.Group>
            <div className="choices">
                {choices.map((choice) => (
                    <Button className='button_hold' key={choice.name} type="primary" onClick={() => handleClick(choice.name)}>
                        <img src={choice.img} alt={choice.name} className="choice-img" />
                    </Button>
                ))}
            </div>
            {history.length > 0 && (
                <Card title="Lịch sử trận đấu" className="history-card">
                    {history.map((round, index) => (
                        <p key={index}>
                            <strong>Ván {index + 1}:</strong> 
                            Bạn chọn <img src={choices.find(c => c.name === round.player)?.img} alt={round.player} className="history-img" /> -
                            Máy chọn <img src={choices.find(c => c.name === round.computer)?.img} alt={round.computer} className="history-img" /> - {round.result}
                        </p>
                    ))}
                </Card>
            )}
            <Card title="Kết quả hiện tại" className="result-card">
                <p><strong>Thắng:</strong> {playerWins} - <strong>Thua:</strong> {computerWins}</p>
                <h3>{result}</h3>
                {winner && <h2 className="winner-text">{winner}</h2>}
            </Card>
            <Button type="primary" onClick={handleRestart} className="restart-button">Chơi lại</Button>
        </div>
    );
};

export default OanTuTi;