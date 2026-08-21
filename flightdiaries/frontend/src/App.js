import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import axios from 'axios';
const baseUrl = 'http://localhost:3000/api/diaries';
const parseErrorMessage = (error) => {
    if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const firstError = errorData?.error?.[0];
        if (firstError) {
            const field = firstError.path?.[0] ?? 'field';
            const message = firstError.message ?? 'unknown error';
            const received = message.includes('received') ? message.split('received')[1]?.trim() : '';
            if (received) {
                return `Incorrect ${field}: ${received}`;
            }
            return `Incorrect ${field}: ${message}`;
        }
        if (typeof error.response?.data === 'string') {
            return error.response.data;
        }
        return error.message;
    }
    return 'Unknown error';
};
const App = () => {
    const [diaries, setDiaries] = useState([]);
    const [date, setDate] = useState('');
    const [weather, setWeather] = useState('sunny');
    const [visibility, setVisibility] = useState('great');
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        axios
            .get(baseUrl)
            .then((response) => {
            setDiaries(response.data);
        })
            .catch((error) => {
            console.error('Error fetching diaries:', error);
        });
    }, []);
    const addDiary = (event) => {
        event.preventDefault();
        setError(null);
        const newDiary = {
            date,
            weather,
            visibility,
            comment: comment || undefined
        };
        axios
            .post(baseUrl, newDiary)
            .then((response) => {
            setDiaries(diaries.concat(response.data));
            setDate('');
            setWeather('sunny');
            setVisibility('great');
            setComment('');
        })
            .catch((err) => {
            setError(parseErrorMessage(err));
        });
    };
    return (_jsxs("div", { children: [_jsx("h1", { children: "Add new entry" }), error && _jsxs("p", { style: { color: 'red' }, children: ["Error: ", error] }), _jsxs("form", { onSubmit: addDiary, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "date", children: "date" }), _jsx("input", { id: "date", type: "date", value: date, onChange: ({ target }) => setDate(target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "visibility" }), _jsx("div", { children: ['great', 'good', 'ok', 'poor'].map((option) => (_jsxs("label", { children: [_jsx("input", { type: "radio", name: "visibility", checked: visibility === option, onChange: () => setVisibility(option) }), option] }, option))) })] }), _jsxs("div", { children: [_jsx("label", { children: "weather" }), _jsx("div", { children: ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'].map((option) => (_jsxs("label", { children: [_jsx("input", { type: "radio", name: "weather", checked: weather === option, onChange: () => setWeather(option) }), option] }, option))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "comment", children: "comment" }), _jsx("input", { id: "comment", value: comment, onChange: ({ target }) => setComment(target.value) })] }), _jsx("button", { type: "submit", children: "add" })] }), _jsx("h2", { children: "Diary entries" }), _jsx("ul", { children: diaries.map((diary) => (_jsxs("li", { children: [_jsx("h3", { children: diary.date }), _jsxs("p", { children: ["visibility: ", diary.visibility] }), _jsxs("p", { children: ["weather: ", diary.weather] })] }, diary.id))) })] }));
};
export default App;
