import { TASKS_LOADING, GET_TASKS, ADD_TASK,
	GET_COMPLETED_TASK, DELETE_TASK } from '../actions/types';
import { WEBSOCKET_MESSAGE } from '../actions/types';

const initialState = {
	tasks: null,
	loading: false,
	completedTask: ''
}

export default function(state = initialState, action) {
	console.log(action.type, action, state);
	switch(action.type) {
		case ADD_TASK:
			const ar = state.tasks.slice();
			ar.unshift(action.payload);
			return {
				...state, tasks: ar
			}
		case TASKS_LOADING:
			return {
				...state,
				loading: true
			}
		case GET_TASKS:
			return {
				...state,
				tasks: action.payload,
				loading: false
			}
		case GET_COMPLETED_TASK:
			function updateCompletedTaskInArray(array, action) {
				console.log('GET_COMPLETED_TASK', array);
				console.log('GET_COMPLETED_TASK',action);
				if(array) {

					return array.map( (item, index) => {
						if (item && action.payload && (item.id !== action.payload.id)) {
				      // This isn't the item we care about - keep it as-is
				      return item
				    }
				    // Otherwise, this is the one we want - return an updated value
				    return {
				      ...item,
				      ...action.payload
				    }
					});
				}
			}
			//updateCompletedTaskInArray()
			return {
				...state,
				tasks: updateCompletedTaskInArray(state.tasks, action)
			}
		case DELETE_TASK:
			console.log(state.tasks.filter(task => task.id !== action.payload))
			console.log(action.payload)
			return {
				...state,
				tasks: state.tasks.filter(task => task.id !== action.payload)
			}
		case WEBSOCKET_MESSAGE:
			//console.log(action.payload)

			function updateObjectInArray(array, action) {
				if(array) {
					return array.map( (item, index) => {
						if(item.id === action.payload.data.db_id) {
							if(action.payload.data.state==='PROGRESS') {
								const nar = item.result.data.slice();
								nar.push(action.payload.data.energy);
								return {
									...item,
									result: { data: nar },
									state: action.payload.data.state
								}
							}
							if(action.payload.data.state==='SUCCESS') {
								//console.log('SUCCESS');
								return {
								...item,
								state: 'SUCCESS'
							}
							}
						}
						return {
							...item
							//...action.item
						}
						});
				}
			}

			function getCompletedTaskId(action) {
				if(action.payload.data.state==='SUCCESS') {
					return action.payload.data.db_id
				}
        		return '';
			}
			return {
				...state,
				tasks: updateObjectInArray(state.tasks, action),
				completedTask: getCompletedTaskId(action)
			}
		default:
			return state;
	}
}