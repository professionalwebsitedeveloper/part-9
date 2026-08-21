import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import axios from 'axios';
const baseUrl = 'http://localhost:3000/api/diaries';
const App = () => {
    const [diaries, setDiaries] = useState([]);
    const [date, setDate] = useState('');
    const [weather, setWeather] = useState('sunny');
    const [visibility, setVisibility] = useState('great');
    const [comment, setComment] = useState('');
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
            .catch((error) => {
            console.error('Error adding diary:', error);
        });
    };
    return (_jsxs("div", { children: [_jsx("h1", { children: "Flight Diaries" }), _jsxs("form", { onSubmit: addDiary, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "date", children: "Date:" }), _jsx("input", { id: "date", value: date, onChange: ({ target }) => setDate(target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "weather", children: "Weather:" }), _jsxs("select", { id: "weather", value: weather, onChange: ({ target }) => setWeather(target.value), children: [_jsx("option", { value: "sunny", children: "sunny" }), _jsx("option", { value: "rainy", children: "rainy" }), _jsx("option", { value: "cloudy", children: "cloudy" }), _jsx("option", { value: "stormy", children: "stormy" }), _jsx("option", { value: "windy", children: "windy" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "visibility", children: "Visibility:" }), _jsxs("select", { id: "visibility", value: visibility, onChange: ({ target }) => setVisibility(target.value), children: [_jsx("option", { value: "great", children: "great" }), _jsx("option", { value: "good", children: "good" }), _jsx("option", { value: "ok", children: "ok" }), _jsx("option", { value: "poor", children: "poor" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "comment", children: "Comment:" }), _jsx("input", { id: "comment", value: comment, onChange: ({ target }) => setComment(target.value) })] }), _jsx("button", { type: "submit", children: "add" })] }), _jsx("ul", { children: diaries.map((diary) => (_jsxs("li", { children: [_jsx("h2", { children: diary.date }), _jsxs("p", { children: [_jsx("strong", { children: "Weather:" }), " ", diary.weather] }), _jsxs("p", { children: [_jsx("strong", { children: "Visibility:" }), " ", diary.visibility] }), diary.comment && _jsx("p", { children: diary.comment })] }, diary.id))) })] }));
};
export default App;
