import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AbstractWidget from "component/widget/base/AbstractWidget.jsx";
import ThresholdConfig from "config/ThresholdConfig";

class JiraWidget extends AbstractWidget {

  /**
   *  "issuesKeys" and "total" properties came from a dataSource, configured in the dashboard configuration.
   *  These properties are array because JSONPath always return arrays. As those data come from
   *  a generic dataSource system, only the Widget can know the real nature of those data.
   */
  static propTypes = {
    dataReceivedAtLeastOne: PropTypes.bool,
    todoIssuesKeys: PropTypes.array,
    todoTotal: PropTypes.array,
    inProgressIssuesKeys: PropTypes.array,
    inProgressTotal: PropTypes.array
  };

  static defaultProps = {
    dataReceivedAtLeastOne: false,
    todoIssuesKeys: [],
    todoTotal: [],
    inProgressIssuesKeys: [],
    inProgressTotal: []
  };

  getWidgetClassNames() {
    return super
      .getWidgetClassNames()
      .concat(ThresholdConfig.get(
        this.props.thresholds.bugs,
        this.props.todoTotal));
  }

  renderHeader() {
    const { todoTotal, todoTitle } = this.props;
    return (
      <h1>
        <strong>{todoTotal} </strong>
        <span>{todoTitle}</span>
      </h1>
    )
  }

  renderContent() {
    const { todoIssuesKeys, inProgressIssuesKeys, dataReceivedAtLeastOne } = this.props;
    if (!dataReceivedAtLeastOne) {
      return this.renderLoading();
    }
    const todoIssues = todoIssuesKeys.map((issueKey) =>
      <li key={issueKey}>
        <span className="icon todo"/>
        <span>{issueKey}</span>
      </li>
    );
    const inProgressIssues = inProgressIssuesKeys.map((issueKey) =>
      <li key={issueKey}>
        <span className="icon inProgress"/>
        <span>{issueKey}</span>
      </li>
    );
    return (
      <ul>
        {todoIssues}
        {inProgressIssues}
      </ul>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  let result = {
    ...AbstractWidget.mapCommonWidgetProps(state, ownProps)
  };
  return result;
};

export default connect(
  mapStateToProps
)(JiraWidget)

