import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Tooltip } from 'react-native-elements';

const TOOLTIP_WIDTH = 250;
const TOOLTIP_PADDING = 10;

function getPopover(tooltipText) {
  return (
    <Text>
      {tooltipText}
    </Text>
  );
}

class CustomTooltip extends Component {
  state = { tooltipHeight: 0 };

  renderHiddenBoxToGetHeight = () => {
    const { tooltipText } = this.props;

    return (
      <View
        style={[
          { width: TOOLTIP_WIDTH, padding: TOOLTIP_PADDING },
          styles.tooltipHiddenBox,
        ]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          this.setState({
            tooltipHeight: height,
          });
        }}
      >
        <Text style={styles.tooltipHiddenText}>
          {tooltipText}
        </Text>
      </View>
    );
  }

  render() {
    const { tooltipText } = this.props;
    const { tooltipHeight } = this.state;

    return (
      <Tooltip
        width={TOOLTIP_WIDTH}
        height={tooltipHeight}
        withOverlay={true}
        popover={getPopover(tooltipText)}
      >
        <>    
          {this.props.children}
          {this.renderHiddenBoxToGetHeight()}
        </>
      </Tooltip>
    );
  }
}

const styles = StyleSheet.create({
  tooltipHiddenBox: {
    position: 'absolute',
    right: 10000000000,
  },
  tooltipHiddenText: {
    color: 'transparent',
  },
});

export default CustomTooltip;
