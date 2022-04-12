import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { CardActionArea, Container } from '@material-ui/core';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import './HomePage.css';
import { useCourseEnrollment } from '../../hooks/useCourseEnrollment';
import { useModules } from '../../hooks/useModules';
import { useUserModules } from '../../hooks/useUserModules';



const DisplayCourses = props => {

    const { modules } = useModules();
    const { getAttempt } = useUserModules();

    return props.courses.map(course => {

            let progress = 0;  // %
            if (props.isEnrolled) {
                let cModules = modules.filter(m => String(m.courseId) === String(course._id));
                let attempts = cModules.map(m => getAttempt(m._id));    // get attempts for each module, if any
                progress = Math.round((attempts.filter(a => a && a.bestScore >= 75).length / cModules.length) * 100);
            }

            return (
                <Link to={`course-modules/${course._id}`} className="course-card" style={{ textDecoration: "none" }}>
                    <Card style={{ height: 250, margin: 5 }} sx={{ maxWidth: 250 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="140"
                                image={course.image}
                                alt="course image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    { course.name }
                                </Typography>
                                {props.isEnrolled ? null :
                                    <Typography noWrap variant="body2" color="text.secondary">
                                        { course.description }
                                    </Typography>}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    {props.isEnrolled ? <Box sx={{ display: 'flex' }} style={{ padding: 5 }}>
                        <Box sx={{ width: '95%', mr: 1 }}>
                            <LinearProgress borderRadius="5" variant="determinate" value={progress} />
                        </Box>
                        <Box sx={{ minWidth: 35, maxWidth: 250 }}>
                            <Typography variant="body2" color="text.secondary">{`${Math.round(
                                progress,      //fix
                            )}%`}</Typography>
                        </Box>
                    </Box> : null}
                </Link>
            )
    })
}

export default function HomePage() {
    const { courses, loading } = useCourses();
    const { isEnrolled } = useCourseEnrollment();

    return (
        <div className="page-content">
            <h2>My Courses</h2>
            <div className='my-courses-content'>
                <DisplayCourses courses={courses.filter(c => isEnrolled(c._id))} isEnrolled={true} />
            </div>
            <div id='all-courses-heading-content'>
                <h2>All Courses</h2>
                <Link to="/all-courses">
                    <p style={{ marginRight: 20, cursor: 'pointer' }}><b>MORE COURSES &gt;</b></p>
                </Link>
            </div>
            <div className='all-courses-content'>
                <DisplayCourses courses={courses.filter(c => !isEnrolled(c._id)).slice(0, 7)} isEnrolled={false} />
            </div>
            <Link to="/chat">
                <Fab color='primary' className='chat-button' variant="extended">
                    <b>+ JOIN CHAT</b>
                </Fab>
            </Link>
        </div>

    );
}