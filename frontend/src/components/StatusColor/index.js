import React from 'react';

const StatusColor = ({ status }) => {
    let color = '#50B83C';

    if (status === 'Maintenance') color = '#919EAB';
    else if (status === 'Loaned') color = '#DE3618';
    else if (status === 'Reserved') color = '#F49342';

    return (<span style={{ color: color }}>{status}</span>);
}

export default StatusColor;