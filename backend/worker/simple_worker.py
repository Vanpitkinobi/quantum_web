'''Script with celery tasks'''

import os
import sys
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER_DIR = os.path.join(BACKEND_DIR, 'server')
sys.path.insert(0, SERVER_DIR)

from task_updater import TaskUpdater
from crash_methods import crash_with_segfault, crash_with_import

import time
from celery import Celery
from config import BROKER_URL, REDIS_URL, REDIS_PORT
import json
from channels.generic.websocket import WebsocketConsumer
import qboard
import numpy as np


WORKERS = Celery('simple_worker')
WORKERS.config_from_object('celeryconfig')


class ArgumentNotFoundError(Exception):
    pass


@WORKERS.task(name='worker.worker.task_add', bind=True)
def task_add(self, params):

    print('params', self, params)

    Q = np.random.rand(30, 30) - 0.5

    solver = qboard.solver(mode="bf")

    TaskUpdater.update_db(db_id=params['db_id'],
                          task_id=self.request.id,
                          new_state='PROGRESS')

    for arg in ['db_id']:
        if arg not in params:
            raise ArgumentNotFoundError('Argument {0} is missing'.format(arg))

    solves = []

    def cb(dic):
        if dic["cb_type"] == qboard.constants.CB_TYPE_NEW_SOLUTION:
            energy = dic["energy"]
            print(energy)
            solves.append(energy)
            self.update_state(state='PROGRESS', meta={'energy': energy,
                                                      'db_id': params['db_id']})

        if dic["cb_type"] == qboard.constants.CB_TYPE_INTERRUPT_TIMEOUT:
            pass

        if dic["cb_type"] == qboard.constants.CB_TYPE_INTERRUPT_TARGET:
            pass

    solver.solve_qubo(Q, callback=cb, timeout=30, verbosity=0)

    TaskUpdater.update_db(db_id=params['db_id'], new_state='SUCCESS',
                          new_result={'data': solves})
    # Send info to channel
    data = {'state': 'SUCCESS', 'progress': 100, 'db_id': params['db_id']}
    msg = {"type": "task_update_message", "data": data}
    TaskUpdater.update_ws(msg)

    return True
