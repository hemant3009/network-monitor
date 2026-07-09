const THRESHOLDS = {
    latency: 150,
    loss: 5,
};

const checkMetric = (metric) => {
    const alerts = [];

    // host down -> critical
    if(metric.status === "down"){
        alerts.push({
            hostId: metric.hostId,
            type: "crit",
            message: `${metric.name} is unreachable`,
        });
        return alerts; // if it's down no poing checking latency/loss
    }

    // high latency -> warning
    if(metric.latency > THRESHOLDS.latency){
        alerts.push({
            hostId: metric.hostId,
            type: "warn",
            message: `${metric.name} latency is high (${metric.latency}ms)`
        });
    }

    // high pkt loss -> warning
    if(metric.loss > THRESHOLDS.loss){
        alerts.push({
            hostId: metric.hostId,
            type: "warn",
            message: `${metric.name} packet loss is high (${metric.loss}%)`
        });
    }

    return alerts;
};

module.exports = {checkMetric};