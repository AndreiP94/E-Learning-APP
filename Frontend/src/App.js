import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Logare/Login";
import Admin from "./Pages/Admin/Admin";
import AdaugaElev from "./Pages/Admin/adaugaElev";
import SchimbaParola from "./Pages/Logare/schimbaParola";
import ProfesoriCursuri from "./Pages/Profesor/profesoriCursuri";
import CursuriLectie from "./Pages/Profesor/cursuriLectie";
import CursuriLectieElevi from "./Pages/Elev/cursuriLectieElevi";
import EleviCursuri from "./Pages/Elev/eleviCursuri";
import AddQuizz from "./Pages/Quizz/addQuizz";
import ShowQuizzProfesor from "./Pages/Quizz/showQuizzProfesor";
import QuizElevStart from "./Pages/Elev/quizElevStart";
import AttemptQuiz from "./Pages/Quizz/attemptQuiz";
import NoteElev from "./Pages/Elev/noteElev";
import RezultateElevi from "./Pages/Profesor/rezultateElevi";
import Chat from "./Pages/Chat/Chat";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/adaugaElev" element={<AdaugaElev />} />
          <Route path="/schimbaParola" element={<SchimbaParola />} />
          <Route path="/profesoriCursuri" element={<ProfesoriCursuri />} />
          <Route path="/curs/:id" element={<CursuriLectie />} />
          <Route path="/cursElev/:id" element={<CursuriLectieElevi />} />
          <Route path="/eleviCursuri" element={<EleviCursuri />} />
          <Route path="/addQuizz" element={<AddQuizz />} />
          <Route path="/quizzProfesor" element={<ShowQuizzProfesor />} />
          <Route path="/quizElevStart" element={<QuizElevStart />} />
          <Route path="/attemptQuiz" element={<AttemptQuiz />} />
          <Route path="/noteElev" element={<NoteElev />} />
          <Route path="/rezultateElevi" element={<RezultateElevi />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
