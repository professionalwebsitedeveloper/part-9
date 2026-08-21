import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import axios from 'axios';
const baseUrl = 'http://localhost:3000/api/diaries';
const App = () => {
    const [diaries, setDiaries] = useState([]);
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
    return (_jsxs("div", { children: [_jsx("h1", { children: "Flight Diaries" }), _jsx("ul", { children: diaries.map((diary) => (_jsxs("li", { children: [_jsx("h2", { children: diary.date }), _jsxs("p", { children: [_jsx("strong", { children: "Weather:" }), " ", diary.weather] }), _jsxs("p", { children: [_jsx("strong", { children: "Visibility:" }), " ", diary.visibility] }), diary.comment && _jsx("p", { children: diary.comment })] }, diary.id))) })] }));
};
export default App;
