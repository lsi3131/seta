import React, {useRef, useState, useEffect} from 'react';
import {useGameContext} from './GameProvider';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const {sendMessage, message, clientId} = useGameContext();

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setDrawing(true);
        sendMessage({type: 'drawing on', offsetX, offsetY});
    };

    const draw = ({nativeEvent}) => {
        if (!drawing) return;
        const {offsetX, offsetY} = nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.lineTo(offsetX, offsetY);
        context.stroke();
        sendMessage({type: 'draw', offsetX, offsetY});
    };

    const stopDrawing = () => {
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setDrawing(false);
        sendMessage({type: 'drawing off'});
    };

    const clearCanvas = () => {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        sendMessage({type: 'clear'});
    };

    useEffect(() => {
        if (message && message.clientId !== clientId) {
            const context = canvasRef.current.getContext('2d');

            switch (message.type) {
                case 'drawing on':
                    context.beginPath();
                    context.moveTo(message.offsetX, message.offsetY);
                    break;
                case 'draw':
                    context.lineTo(message.offsetX, message.offsetY);
                    context.stroke();
                    break;
                case 'drawing off':
                    context.closePath();
                    break;
                case 'clear':
                    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    break;
                default:
                    break;
            }
        }
    }, [message, clientId]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                width="800"
                height="600"
                style={{border: '1px solid black'}}
            />
            <button onClick={clearCanvas}>Clear</button>
        </div>
    );
};

export default Canvas;
