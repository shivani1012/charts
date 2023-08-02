import React, { useState, useEffect } from 'react';
import { Chart as ChartJs, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJs.register(
    CategoryScale,
    BarElement,
    LinearScale,
    ArcElement,
    Tooltip
)

const BarChart = () => {

    const [chart, setChart] = useState([]);

    var baseUrl = "https://mocki.io/v1/b2ac46d3-385d-448a-a77a-9bc2c5b5dcbc";

    useEffect(() => {
        const fetchData = async() => {
            await fetch(`${baseUrl}`, {
                method: 'GET'
            }).then((response) => {
                response.json().then((json) => {
                    setChart(json.data)
                })
            }).catch((error) => {
                console.log(error);
            })
        }
        fetchData()
    }, [])

    const totalNewCases = () => {
        return chart.reduce((total, update) => {
          const newCases = parseInt(
            (update.update.match(/\d+ new cases/) || [])[0]
          );
          return total + (isNaN(newCases) ? 0 : newCases);
        }, 0);
    };

    const totalRecoveries = () => {
        return chart.reduce((total, update) => {
          const recoveries = parseInt(
            (update.update.match(/\d+ recoveries/) || [])[0]
          );
          return total + (isNaN(recoveries) ? 0 : recoveries);
        }, 0);
    };

    const totalDeaths = () => {
        return chart.reduce((total, update) => {
          const deaths = parseInt((update.update.match(/\d+ deaths/) || [])[0]);
          return total + (isNaN(deaths) ? 0 : deaths);
        }, 0);
    };

    var data = {
        type: 'bar',
        labels: ["Total New Cases", "Total Recoveries", "Total Deaths"],
        datasets: [{
          label: 'Total Data',
          data: [totalNewCases(), totalRecoveries(), totalDeaths()],
          backgroundColor: ["#071952", "#0B666A", "#35A29F"],
          borderWidth: 1
        }]
    }

    var options = {
        events: ['mousemove', 'touchstart', 'touchmove'],
        plugins: {
            tooltip: {
                events: ['mousemove']
            }
        },
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        legend: {
            label: {
                fontSize: 28
            }
        }
    }


    // Statewise Data 
    const allStateData = (state) => {
        return chart.filter((update) => update.update.includes(state));
    };
    
    const allState = [
        "Gujarat",
        "West Bengal",
        "Telangana",
        "Uttar Pradesh",
        "Madhya Pradesh",
        "Delhi",
        "Rajasthan",
        "Maharashtra",
        "Bihar",
        "Odisha",
        "Andhra Pradesh",
        "Karnataka",
        "Haryana",
    ];

    const allStateReport = allState.map((state) => ({
        state: state,
        newCases: allStateData(state).reduce(
          (total, update) =>
            total +
            parseInt((update.update.match(/\d+ new cases/) || [])[0] || 0),
          0
        ),
        recoveries: allStateData(state).reduce(
          (total, update) =>
            total +
            parseInt((update.update.match(/\d+ recoveries/) || [])[0] || 0),
          0
        ),
        deaths: allStateData(state).reduce(
          (total, update) => total + parseInt((update.update.match(/\d+ deaths/) || [])[0] || 0),
          0
        ),
    }));

    var stateData = {
        labels: allState,
        datasets: [
            {
                data: allStateReport.map((data) => data.newCases),
                backgroundColor: ["#865439", "#865439", "#865439"],
                borderWidth: 1
            },
            {
                data: allStateReport.map((data) => data.recoveries),
                backgroundColor: ["#F49D1A", "#F49D1A", "#F49D1A"],
                borderWidth: 1
            },
            {
                data: allStateReport.map((data) => data.deaths),
                backgroundColor: ["#820000", "#820000", "#820000"],
                borderWidth: 1
            }
        ]
    }

    var options = {
        events: ['mousemove', 'touchstart', 'touchmove'],
        plugins: {
            tooltip: {
                events: ['mousemove']
            }
        },
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        legend: {
            label: {
                fontSize: 28
            }
        }
    }

    return (
        <div>
            <div className='mainChart'>
                <div className='barChart'>
                    <h1 className='heading'>Bar Chart: Total new cases, recoveries & deaths (Overall)</h1>
                    <div>
                        <Bar 
                            data={data}
                            height={400}
                            options={options}
                        />
                    </div>
                </div>
                <div className='piechart'>
                    <h1 className='heading'>Pie Chart: Total new cases, recoveries & deaths (Overall)</h1>
                    <div>
                        <Pie 
                            data={{
                                type: 'bar',
                                labels: ["Total New Cases", "Total Recoveries", "Total Deaths"],
                                datasets: [{
                                    label: 'Total Data',
                                    data: [totalNewCases(), totalRecoveries(), totalDeaths()],
                                    backgroundColor: ["#1D5D9B", "#68B984", "#DC3535"],
                                    borderWidth: 1
                                }]
                            }}
                            height={400}
                            width={600}
                            options={options}
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className='barChartState'>
                    <h1 className='heading'>Bar Chart: Total new cases, recoveries & deaths (Case Wise State Data)</h1>
                    <div>
                        <Bar 
                            data={stateData}
                            height={400}
                            options={options}
                        />
                    </div>
                </div>
                <div className='stateTable'>
                    <h1 className='heading'>Total new cases, recoveries & deaths (State-wise report in tabular form)</h1>
                    <table>
                        <thead>
                        <tr>
                            <th>State</th>
                            <th>New Cases</th>
                            <th>Recoveries</th>
                            <th>Deaths</th>
                        </tr>
                        </thead>
                        <tbody>
                        {allStateReport.map((report) => (
                            <tr key={report.state}>
                            <td>{report.state}</td>
                            <td>{report.newCases}</td>
                            <td>{report.recoveries}</td>
                            <td>{report.deaths}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BarChart