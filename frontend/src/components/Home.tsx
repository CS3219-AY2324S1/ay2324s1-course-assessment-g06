import React, { useState, useEffect } from "react";

import { getPublicContent } from "../services/user.service";

const Home: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <div>
          Link to questions: <a href="/questions">Questions</a>
        </div>
        <div>This is a test.</div>
        <div>{content}</div>
      </header>
    </div>
  );
};

export default Home;