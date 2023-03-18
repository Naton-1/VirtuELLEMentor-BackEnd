import React, {Component} from 'react';
import axios from 'axios';
import { Card, Modal, ModalBody, ModalHeader, Table, Row, Col, Badge } from 'reactstrap';

export default class Session extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentSession: {}, 
            loggedAnswers: [],
            noAnsMsg: "",
            modalOpen: false,
            mentorResponses: []
        }
        
    }
    
    convertTimetoDecimal = (time) => {
        let hoursMinutes = time.split(/[.:]/);
        let hours = parseInt(hoursMinutes[0], 10);
        let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + (minutes / 60);
    }

    calculateTimeDiff = (start, end) => {
        let result = (end - start);

        // If negative duration is added, correct it
        if (result < 0) {
            result += 24;
        }
        // Format number to 2 decimal places
        return result.toFixed(2);
    }

    showLoggedAnswers = (session) => {
        this.getLoggedAnswers(session.sessionID); 
        this.getMentorResponses(session.sessionID);
        this.getMentorQuestion(session.questionID);
        this.toggleModal(); 
        this.setState({ currentSession: session })
    }

    getLoggedAnswers = (sessionID) => {
        console.log("sessionId: ", sessionID); 

        let header = {
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            params: {sessionID: sessionID}  
        };

        axios.get(this.props.serviceIP + "/loggedanswer", header)
        .then(res => {
            console.log("logged answer: ", res.data); 

            if (res.data.Message) {
                this.setState({ noAnsMsg: res.data.Message });
            }
            else {
                this.setState({ loggedAnswers: res.data }); 
            }
            
        }).catch(error => {
            console.log("get logged answer error: ", error); 
        })
    }

    getMentorResponses = (session_id) => {
        let header = {
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 'Content-Type': 'application/json' },
            params: {session_id: session_id}
        };
    
        axios.get(this.props.serviceIP + "/studentresponses", header)
        .then(res => {
            console.log("mentor responses: ", res.data);
    
            if (res.data.Message) {
                this.setState({ noQuesMsg: res.data.Message });
            }
            else {
                this.setState({ mentorResponses: res.data });
            }
    
        }).catch(error => {
            console.log("get mentor responses error: ", error);
        })
    }

    // In progress
    getMentorQuestion = (questionID) => {
        
        let header = {
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            params: {questionID: questionID}
        };

        axios.get(this.props.serviceIP + "/question", header)
        .then(res => {
            console.log("mentor responses: ", res.data);
    
            if (res.data.Message) {
                this.setState({ noQuesMsg: res.data.Message });
            }
            else {
                this.setState({ mentorQuestions: res.data });
            }
    
        }).catch(error => {
            console.log("get mentor question error: ", error);
        })
    }

    toggleModal = () => {
        if (this.state.modalOpen === true) {
            this.setState({ 
                loggedAnswers: [],
                noAnsMsg: "",
                mentorResponses: [],
                noQuesMsg: ""
            })
        }

        this.setState({ modalOpen: !this.state.modalOpen }); 
    }

    render() {
        console.log("length: ", this.state.loggedAnswers);
        return (
            <div>
                <Card style={{border: "none", height: "56vh", overflow: "scroll"}}>
                    <Table hover className="minimalisticTable">
                        <thead>
                            <tr>
                            <th>Session ID</th>
                            <th>Date</th>
                            <th>User ID</th>
                            <th>Score</th>
                            <th>Duration</th>
                            <th>Module ID</th>
                            <th>Module Name</th>
                            <th>Platform</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.sessions.map(
                                (session, i) => {
                                    return (
                                    <tr key={i} onClick={() => this.showLoggedAnswers(session)}>
                                        <td>{session.sessionID}</td>
                                        <td>{session.sessionDate}</td>
                                        <td>{session.userID}</td>
                                        <td>{session.playerScore}</td>
                                        <td>
                                            {session.endTime !== null && session.startTime !== null ?
                                                (this.calculateTimeDiff(this.convertTimetoDecimal(session.startTime), this.convertTimetoDecimal(session.endTime))) + " hrs"
                                            : "invalid values"}
                                        </td>
                                        <td>{session.moduleID}</td>
                                        <td>{session.moduleName}</td>
                                        <td>{session.platform}</td>
                                    </tr>
                                    )
                                }
                            )}
                        </tbody>
                    </Table>
                </Card>

                <Modal size="lg" isOpen={this.state.modalOpen} toggle={() => this.toggleModal()}>
                    <ModalHeader toggle={() => this.toggleModal()} style={{paddingBottom: "0px"}}>
                        Logged Answers
                        <Row style={{paddingTop: "10px"}}>
                            <Col>
                                <h6><Badge> Module ID: {this.state.currentSession.moduleID}</Badge></h6>
                            </Col>
                            <Col>
                                <h6><Badge>Module Name: {this.state.currentSession.moduleName}</Badge></h6>
                            </Col>
                            <Col>
                                <h6><Badge>Mode: {this.state.currentSession.mode}</Badge></h6>
                            </Col>
                        </Row>
                    </ModalHeader>
                    <ModalBody>
                        {this.state.loggedAnswers.length !== 0 ? 
                            <div>
                                <Row>
                                    <Col style={{textDecoration: "underline"}}>Term ID</Col>
                                    <Col style={{textDecoration: "underline"}}>Term</Col>
                                    <Col style={{textDecoration: "underline"}}>Answer</Col>

                                </Row>
                                <Card style={{overflow: "scroll", height: "35vh", border: "none"}}>
                                {this.state.loggedAnswers.map((ans, i) => {
                                    return (
                                        <Row key={i}>
                                            <Col>{ans.termID}</Col>
                                            <Col>{ans.front}</Col>
                                            <Col>
                                                {
                                                    ans.correct  
                                                    ? <a style={{color: "green"}}>correct</a> 
                                                    : <a style={{color: "red"}}>incorrect</a>
                                                }
                                            </Col>
                                        </Row>
                                )})}
                                <Row><br /></Row>
                                <div style={{ fontSize: "24px" }}><strong>Mentor Questions</strong></div>
                                <Row><br /></Row>
                                <Row>
                                    <Col style={{textDecoration: "underline"}}>Question</Col>
                                    <Col style={{textDecoration: "underline"}}>Response</Col>
                                </Row>
                                
                                {this.state.mentorResponses.length !== 0 ? (
                                    this.state.mentorResponses.map((ans, i) => (
                                        <Row key={i}>
                                            <Col></Col>
                                            <Col>{ans.response}</Col>
                                        </Row>
                                    ))
                                ) : (
                                    <Row>
                                        <Col>{this.state.noQuesMsg}</Col>
                                    </Row>
                                )}
                                </Card>
                            </div>
                            : <p>{this.state.noAnsMsg}</p>
                        }
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}