import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import { getTasks, addTask } from '../actions/tasksActions';
import { getCompletedTask } from '../actions/tasksActions';
import { deleteTask } from '../actions/tasksActions';
import HighChart from  './HightChart';
import ButtonBlock from  './common/Buttons'
import styled from "styled-components";

export const LeftMenuContainer = styled.div`
  &:hover {
  	cursor: pointer;
  }
  ${props => props.activeEl && 'border: 1px solid grey;'}
  padding: 7px 7px 7px 0;
 
`;

const styles = {
	taskBlock: {
		maxHeight: '410px',
		overflowY: 'auto'
	}
}

class Home extends Component {
	constructor() {
		super();
		this.state = {
			active: 0
		}
		this.handleClickCreateTask = this.handleClickCreateTask.bind(this);
	}
	componentDidMount() {
		this.props.getTasks()
	}
	componentDidUpdate(prevProps) {
		if(this.props.tasks.completedTask!==prevProps.tasks.completedTask) {
			this.props.getCompletedTask(this.props.tasks.completedTask);
		}
	}
	onDeleteClick(id) {
		this.props.deleteTask(id);
	}

	onChange(event, index) {
		this.setState({
			active: index
		})
	}

	handleClickCreateTask() {
		this.setState({active: 0});
		this.props.addTask({params: {}});
	}

	render() {

		const { tasks, loading } = this.props.tasks;
		console.log(tasks);
		const task = tasks && tasks[this.state.active];
		const taskData = task ? task.result.data : [];

		let tasksItems;
		//console.log(this.props)

		if(tasks === null || loading) {
			tasksItems = <div>Loading...</div>
		} else {
			if(tasks.length > 0) {
				tasksItems = tasks && tasks.length > 0 && tasks.map((task, index )=> {
					let taskResult;

					if("data" in task.result) {
						taskResult = task.result.data[task.result.data.length - 1]
					} else if("exception" in task.result) {
						taskResult = task.result.exception
					} else {
						taskResult = 'Waiting...'
					}


					return(
						<div key={task.id}>
							<LeftMenuContainer
								activeEl={index === this.state.active}
								onClick={() => this.setState({active: index})}
								className="row mt-3 mb-3">
								<div className="col-md-8">
									<b>Min energy:</b> {taskResult} {' '} <br/>
									<b>State:</b> {' '}
										<span
											className={classnames( 'badge',
												{'badge-success': ( task.state === 'SUCCESS' )},
												{'badge-info': ( task.state === 'CREATED' )},
												{'badge-info': ( task.state === 'PROGRESS' )},
												{'badge-danger': ( task.state === 'FAILURE' )}
											)}
										>
											{task.state}
										</span> {' '} <br/>

								</div>
								<div className="col-md-2">
									<button
										className="btn btn-outline-dark"
										onClick={this.onDeleteClick.bind(this, task.id)}
									>
										Delete
									</button>
								</div>
							</LeftMenuContainer>
						</div>
					)
				});
			} else {
				tasksItems = <div>No tasks found...</div>
			}
		}


		return(
			<div className="container">

				<div className="row">
					<div style={styles.taskBlock} className="col-md-3">
						{tasksItems}
					</div>
					<div className="col-md-8">
						<HighChart data={taskData} />
					</div>
				</div>

				<div>
					<ButtonBlock handleClickCreateTask={this.handleClickCreateTask} />
				</div>

			</div>
		)
	}
}

Home.propTypes = {
	getTasks: PropTypes.func.isRequired,
	getCompletedTask: PropTypes.func.isRequired,
	deleteTask: PropTypes.func.isRequired,
	tasks: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	tasks: state.tasks
});

export default connect(mapStateToProps, {
	getTasks,
	getCompletedTask,
	deleteTask,
	addTask
})(withRouter(Home));
