import React from 'react';
import Visualization from './Visualization';
import Dashboards from '../components/Dashboards';


const HomePage = () => (
    <div container m-10 pt-10 p-4>
        <h1 className="text-2xl font-bold text-center my-4">Dashboards</h1>
        <Dashboards/>
        <Visualization/>
        
    </div>
);

export default HomePage;
