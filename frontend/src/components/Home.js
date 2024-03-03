import React from 'react';
import { useNavigate } from 'react-router-dom';
import LatestLinks from './LatestLinks'; // Import der neuen Komponente
function Home() {
  let navigate = useNavigate();

  return (
   <div> 
        <h1 >Welcome to Knowledge<sup>App</sup></h1>
        <h3>Cloud-Driven Learning: Uniting DevOps Minds.</h3>
        <p>Welcome to our knowledge hub! At KnowledgeApp, we're dedicated to fostering a community of passionate learners in the fields of DevOps, Cloud Computing, and AWS.</p>
        <p>Our mission is to provide a platform where students can discover, share, and discuss valuable resources, empowering one another to excel in their learning journey.</p>
        <p>Join us today and embark on a cloud-driven adventure towards mastering the latest technologies and shaping the future of IT.</p>
        <p>Together, let's soar to new heights of knowledge!</p>

      <LatestLinks /> {/* Verwendung der neuen Komponente */}
    </div>
  );
}

export default Home;
