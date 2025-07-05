// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import LoginPage from './pages_bk/LoginPage';
// import CallbackPage from './pages_bk/CallbackPage';
// import DevicesPage from './pages_bk/DevicesPage';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/callback" element={<CallbackPage />} />
//         <Route path="/devices" element={<DevicesPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import CallbackPage from './pages/CallbackPage/CallbackPage';
import DevicesPage from './pages/DevicePage/DevicePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/devices" element={<DevicesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
