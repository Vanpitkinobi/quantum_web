import React from 'react';
import {styles} from "./styles";

const ButtonBlock = (props) => {

  return (
    <div style={styles.buttonBlock}>

        <div style={styles.buttonS}>
          <button
            style={styles.button}
            onClick={props.handleClickCreateTask}
          >
          Start
        </button>

        </div>

      </div>
  );
};


export default ButtonBlock;
