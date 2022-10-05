'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var styled = _interopDefault(require('styled-components'));
var core = require('@material-ui/core');
var React = require('react');
var React__default = _interopDefault(React);
var ReactExport = _interopDefault(require('react-data-export'));
var icons = require('@material-ui/icons');
var lab = require('@material-ui/lab');
var Iframe = _interopDefault(require('styled-components'));
var SearchIcon = _interopDefault(require('@material-ui/icons/Search'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  color: ", " !important\n  background-color: ", " !important\n  text-transform: ", " !important\n  margin: ", " !important\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var ButtonVariant = styled(core.Button)(_templateObject(), function (props) {
  return props.textcolor;
}, function (props) {
  return props.backgroundcolor;
}, function (props) {
  return props.uppercase;
}, function (props) {
  return props.margin;
});

var colors = {
  white: '#FFFFFF',
  green: '#336666',
  textSecondary: '#66788A',
  red: '#ED4740',
  border: '#DFE3E8',
  tableHead: '#E9ECEF',
  disabledBackground: '#E0E0E0'
};

function Button(_ref) {
  var text = _ref.text,
      _ref$uppercase = _ref.uppercase,
      uppercase = _ref$uppercase === void 0 ? 'none' : _ref$uppercase,
      icon = _ref.icon,
      onClick = _ref.onClick,
      type = _ref.type,
      _ref$textcolor = _ref.textcolor,
      textcolor = _ref$textcolor === void 0 ? colors.white : _ref$textcolor,
      _ref$fullWidth = _ref.fullWidth,
      fullWidth = _ref$fullWidth === void 0 ? false : _ref$fullWidth,
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? colors.green : _ref$backgroundColor,
      disabled = _ref.disabled,
      margin = _ref.margin;
  return React__default.createElement(ButtonVariant, {
    disabled: disabled,
    title: text,
    uppercase: uppercase,
    variant: "contained",
    backgroundcolor: backgroundColor,
    onClick: onClick,
    type: type,
    textcolor: textcolor,
    fullWidth: fullWidth,
    margin: margin
  }, icon, text);
}

var arePropsEqual = function arePropsEqual(prev, next) {
  return prev.disabled === next.disabled && prev.onClick === next.onClick;
};

var Button$1 = React.memo(Button, arePropsEqual);

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  color: ", " !important\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$1() {
  var data = _taggedTemplateLiteral(["\n  padding: ", "px\n  width: ", " !important\n  min-heinght:", " !important\n  height: ", " !important\n  border: ", " !important\n"]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}
var Paper = styled(core.Paper)(_templateObject$1(), function (props) {
  return props.padding;
}, function (props) {
  return props.width;
}, function (props) {
  return props.minheight;
}, function (props) {
  return props.height;
}, function (props) {
  return props.bordercolor ? "1px solid ".concat(props.bordercolor) : '';
});
var Helper = styled(core.FormHelperText)(_templateObject2(), function (props) {
  return props.helpercolor;
});

function Card(_ref) {
  var children = _ref.children,
      width = _ref.width,
      minheight = _ref.minheight,
      height = _ref.height,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? 8 : _ref$padding,
      borderColor = _ref.borderColor,
      error = _ref.error;
  return React__default.createElement(Paper, {
    width: width,
    minheight: minheight,
    height: height,
    padding: padding,
    bordercolor: error ? borderColor : null
  }, children, error && React__default.createElement(Helper, {
    helpercolor: borderColor
  }, error));
}

var Card$1 = React.memo(Card);

function Confirm(_ref) {
  var title = _ref.title,
      text = _ref.text,
      textButtonSuccess = _ref.textButtonSuccess,
      textButtonCancel = _ref.textButtonCancel,
      backgroundColorButtonCancel = _ref.backgroundColorButtonCancel,
      backgroundColorButtonSuccess = _ref.backgroundColorButtonSuccess,
      open = _ref.open,
      handleClose = _ref.handleClose,
      handleSuccess = _ref.handleSuccess;
  return React__default.createElement(core.Dialog, {
    open: open,
    onClose: handleClose,
    "aria-labelledby": "responsive-dialog-title"
  }, React__default.createElement(core.DialogTitle, {
    id: "responsive-dialog-title"
  }, title), React__default.createElement(core.DialogContent, null, React__default.createElement(core.DialogContentText, null, text, " ")), React__default.createElement(core.DialogActions, null, React__default.createElement(Button$1, {
    onClick: handleClose,
    backgroundColor: backgroundColorButtonCancel,
    text: textButtonCancel
  }), React__default.createElement(Button$1, {
    onClick: handleSuccess,
    backgroundColor: backgroundColorButtonSuccess,
    text: textButtonSuccess,
    autoFocus: true
  })));
}

function arePropsEqual$1(prev, next) {
  return prev.title === next.title && prev.text === next.text && prev.open === next.open && prev.handleClose === next.handleClose && prev.handleSuccess === next.handleSuccess;
}

var index = React.memo(Confirm, arePropsEqual$1);

var ExcelFile = ReactExport.ExcelFile;
var ExcelSheet = ExcelFile.ExcelSheet;

function ExportXLSX(_ref) {
  var _ref$fileName = _ref.fileName,
      fileName = _ref$fileName === void 0 ? 'tabela' : _ref$fileName,
      _ref$sheetName = _ref.sheetName,
      sheetName = _ref$sheetName === void 0 ? 'dados' : _ref$sheetName,
      dataSet = _ref.dataSet,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? colors.white : _ref$color,
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? colors.green : _ref$backgroundColor;
  return React__default.createElement(ExcelFile, {
    element: React__default.createElement(core.IconButton, {
      style: {
        color: color,
        backgroundColor: backgroundColor
      }
    }, React__default.createElement(icons.GetApp, null)),
    filename: fileName
  }, React__default.createElement(ExcelSheet, {
    dataSet: dataSet,
    name: sheetName
  }));
}

var index$1 = React.memo(ExportXLSX);

function _templateObject$2() {
  var data = _taggedTemplateLiteral(["\n  margin: ", " !important\n  color: ", " !important\n  background-color: ", " !important\n  position: fixed !important;\n\tright: ", " !important;\n\tbottom: ", "!important;\n"]);

  _templateObject$2 = function _templateObject() {
    return data;
  };

  return data;
}
var StyleFloatButton = styled(core.Fab)(_templateObject$2(), function (props) {
  return props.margin;
}, function (props) {
  return props.color;
}, function (props) {
  return props.backgroundcolor;
}, function (props) {
  return props.right;
}, function (props) {
  return props.bottom;
});

function FloatButton(_ref) {
  var _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      onClick = _ref.onClick,
      icon = _ref.icon,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'primary' : _ref$color,
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? colors.green : _ref$backgroundColor,
      _ref$margin = _ref.margin,
      margin = _ref$margin === void 0 ? '8px' : _ref$margin,
      _ref$right = _ref.right,
      right = _ref$right === void 0 ? '40px' : _ref$right,
      _ref$bottom = _ref.bottom,
      bottom = _ref$bottom === void 0 ? '40px' : _ref$bottom;
  return React__default.createElement(StyleFloatButton, {
    color: color,
    backgroundcolor: backgroundColor,
    margin: margin,
    disabled: disabled,
    onClick: onClick,
    right: right,
    bottom: bottom
  }, icon);
}

function arePropsEqual$2(prev, next) {
  return prev.disabled === next.disabled && prev.onClick === next.onClick;
}

var index$2 = React.memo(FloatButton, arePropsEqual$2);

function _templateObject11() {
  var data = _taggedTemplateLiteral(["\n  color: ", " !important\n"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["\nmargin-top: 0px !important\nmargin-bottom: 0px !important\nbackground: ", "\nwidth:", "\n"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["\nmargin-top: 0px !important\nmargin-bottom: 0px !important\nbackground: ", "\nwidth:", "\n"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n  text-align: ", " !important\n  width:", " !important\n  max-width:", "!important\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n  margin-left: 8px !important\n  color: ", " !important\n  font-size: 10px !important\n  font-style: italic !important\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n  color: ", " !important\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  margin-top: 8px\n\tmargin-bottom: 8px\n\tborder: ", " solid ", "\n\tborder-radius: 4px\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  margin-bottom: 8px\n  margin-rigth:16px !important\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  margin-top: 0px !important\n  margin-bottom: 0px !important\n  background: ", "\n  width:", "\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$1() {
  var data = _taggedTemplateLiteral(["\n  width: 0.1px\n  height: 0.1px\n  opacity: 0\n  overflow: hidden\n  position: absolute\n  cursor: pointer\n  display: none\n  z-index: -1\n"]);

  _templateObject2$1 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$3() {
  var data = _taggedTemplateLiteral(["\n  cursor:pointer\n  border-radius: 4px\n  background-color: ", "\n  color: ", "\n  text-align: center\n  height:40px\n  min-width:20%\n  margin-top:0px\n  margin-bottom:0px\n  padding-top:8px\n"]);

  _templateObject$3 = function _templateObject() {
    return data;
  };

  return data;
}
var LabelFile = styled.label(_templateObject$3(), function (props) {
  return props.labelfilebackgroundcolor;
}, function (props) {
  return props.labelfilecolor;
});
var InputFile = styled.input(_templateObject2$1());
var TextField = styled(core.TextField)(_templateObject3(), function (props) {
  return props.disabled ? '#E0E0E0' : 'none';
}, function (props) {
  return props.width ? props.width : '100%';
});
var BoxInput = styled(core.Box)(_templateObject4());
var BoxValidation = styled(core.Box)(_templateObject5(), function (props) {
  return props.error ? '1px' : '0px';
}, colors.red);
var Helper$1 = styled(core.FormHelperText)(_templateObject6(), function (props) {
  return props.helpercolor;
});
var LabelHelper = styled(core.Typography)(_templateObject7(), function (props) {
  return props.labelcolor;
});
var Select = styled(core.Select)(_templateObject8(), function (props) {
  return props.textaling ? props.textaling : 'left';
}, function (props) {
  return props.width ? props.width : '100%';
}, function (props) {
  return props.maxWidth ? props.maxWidth : '100%';
});
var InputSelect = styled(core.OutlinedInput)(_templateObject9(), function (props) {
  return props.disabled ? '#E0E0E0' : 'none';
}, function (props) {
  return props.width ? props.width : '100%';
});
var InputSelectSearch = styled(core.TextField)(_templateObject10(), function (props) {
  return props.disabled ? '#E0E0E0' : 'none';
}, function (props) {
  return props.width ? props.width : '100%';
});
var Required = styled(core.Typography)(_templateObject11(), colors.red);

function FormInput(_ref) {
  var name = _ref.name,
      label = _ref.label,
      labelHelper = _ref.labelHelper,
      placeholder = _ref.placeholder,
      value = _ref.value,
      onChange = _ref.onChange,
      _ref$required = _ref.required,
      required = _ref$required === void 0 ? false : _ref$required,
      _ref$error = _ref.error,
      error = _ref$error === void 0 ? '' : _ref$error,
      disabled = _ref.disabled,
      InputProps = _ref.InputProps,
      inputProps = _ref.inputProps,
      width = _ref.width,
      _ref$fullWidth = _ref.fullWidth,
      fullWidth = _ref$fullWidth === void 0 ? false : _ref$fullWidth,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'text' : _ref$type,
      _ref$labelColor = _ref.labelColor,
      labelColor = _ref$labelColor === void 0 ? colors.textSecondary : _ref$labelColor,
      _ref$helperColor = _ref.helperColor,
      helperColor = _ref$helperColor === void 0 ? colors.red : _ref$helperColor,
      onClick = _ref.onClick,
      icon = _ref.icon,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur,
      _ref$maxLength = _ref.maxLength,
      maxLength = _ref$maxLength === void 0 ? 100 : _ref$maxLength;
  return React__default.createElement(BoxInput, {
    width: width,
    flexGrow: 1
  }, React__default.createElement(core.Box, {
    display: "flex",
    flexDirection: "row"
  }, React__default.createElement(core.Typography, {
    title: label,
    variant: "h6"
  }, label), required && React__default.createElement(Required, null, "*"), labelHelper && React__default.createElement(LabelHelper, {
    labelcolor: labelColor,
    title: labelHelper
  }, "( ", labelHelper, " )")), React__default.createElement(TextField, _extends({
    width: onClick ? '5%' : width,
    type: type,
    disabled: disabled,
    name: name,
    error: error,
    title: placeholder,
    placeholder: placeholder,
    InputProps: InputProps,
    inputProps: inputProps ? inputProps : {
      maxLength: maxLength
    },
    fullWidth: fullWidth,
    margin: "dense",
    variant: "outlined",
    value: value,
    onChange: onChange,
    onFocus: onFocus,
    onBlur: onBlur
  }, name)), onClick && React__default.createElement(core.IconButton, {
    onClick: onClick
  }, icon), error && React__default.createElement(Helper$1, {
    helpercolor: helperColor
  }, error));
}

var testName = function testName(prev, next) {
  return prev.name.value === next.name.value && prev.value === next.value && prev.error === next.error && prev.disabled === next.disabled && prev.InputProps === next.InputProps && prev.onClick === next.onClick && prev.onChange === next.onChange && prev.onBlur === next.onBlur;
};

var testValue = function testValue(prev, next) {
  return prev.name === next.name && prev.value === next.value && prev.error === next.error && prev.disabled === next.disabled && prev.InputProps === next.InputProps && prev.onClick === next.onClick && prev.onChange === next.onChange && prev.onBlur === next.onBlur;
};

var arePropsEqual$3 = function arePropsEqual(prev, next) {
  if (prev.name && next.name) {
    return testName(prev, next);
  }

  return testValue(prev, next);
};

var index$3 = React.memo(FormInput, arePropsEqual$3);

function FormInputFile(_ref) {
  var labelFile = _ref.labelFile,
      _ref$labelfileBackgro = _ref.labelfileBackgroundColor,
      labelfileBackgroundColor = _ref$labelfileBackgro === void 0 ? colors.green : _ref$labelfileBackgro,
      _ref$labelFileColor = _ref.labelFileColor,
      labelFileColor = _ref$labelFileColor === void 0 ? colors.white : _ref$labelFileColor,
      value = _ref.value,
      onChange = _ref.onChange,
      error = _ref.error,
      _ref$helperColor = _ref.helperColor,
      helperColor = _ref$helperColor === void 0 ? colors.red : _ref$helperColor,
      _ref$fullWidth = _ref.fullWidth,
      fullWidth = _ref$fullWidth === void 0 ? false : _ref$fullWidth;
  return React__default.createElement(BoxInput, null, React__default.createElement(BoxValidation, {
    display: "flex",
    flexdirection: "row",
    error: error
  }, React__default.createElement(LabelFile, {
    labelfilebackgroundcolor: labelfileBackgroundColor,
    labelfilecolor: labelFileColor
  }, labelFile, React__default.createElement(InputFile, {
    type: "file",
    onChange: onChange
  })), React__default.createElement(TextField, {
    disabled: true,
    margin: "dense",
    variant: "outlined",
    fullWidth: fullWidth,
    value: value
  })), error && React__default.createElement(Helper$1, {
    helpercolor: helperColor
  }, error));
}

var index$4 = React.memo(FormInputFile);

function FormSelect(_ref) {
  var name = _ref.name,
      label = _ref.label,
      labelHelper = _ref.labelHelper,
      value = _ref.value,
      onChange = _ref.onChange,
      error = _ref.error,
      disabled = _ref.disabled,
      _ref$labelWithValue = _ref.labelWithValue,
      labelWithValue = _ref$labelWithValue === void 0 ? false : _ref$labelWithValue,
      items = _ref.items,
      labelInitialItem = _ref.labelInitialItem,
      _ref$labelColor = _ref.labelColor,
      labelColor = _ref$labelColor === void 0 ? colors.textSecondary : _ref$labelColor,
      _ref$helperColor = _ref.helperColor,
      helperColor = _ref$helperColor === void 0 ? colors.red : _ref$helperColor,
      width = _ref.width,
      maxWidth = _ref.maxWidth,
      _ref$required = _ref.required,
      required = _ref$required === void 0 ? false : _ref$required,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur;
  return React__default.createElement(BoxInput, null, React__default.createElement(core.Box, {
    display: "flex",
    flexDirection: "row"
  }, React__default.createElement(core.Typography, {
    title: label,
    variant: "h6"
  }, label), required && React__default.createElement(Required, null, "*"), labelHelper && React__default.createElement(LabelHelper, {
    labelcolor: labelColor,
    title: labelHelper
  }, "( ", labelHelper, " )")), React__default.createElement(Select, _extends({
    maxWidth: maxWidth,
    width: width,
    disabled: disabled,
    value: value,
    onChange: onChange,
    onFocus: onFocus,
    onBlur: onBlur,
    input: React__default.createElement(InputSelect, {
      error: error,
      margin: "dense"
    })
  }, name), React__default.createElement(core.MenuItem, {
    value: 0
  }, labelInitialItem), items.map(function (item) {
    return React__default.createElement(core.MenuItem, {
      key: item.value,
      value: item.value
    }, labelWithValue && "".concat(item.value, " - "), " ", item.label);
  })), error && React__default.createElement(Helper$1, {
    helpercolor: helperColor
  }, error));
}

var testName$1 = function testName(prev, next) {
  return prev.name.value === next.name.value && prev.value === next.value && prev.error === next.error && prev.disabled === next.disabled && prev.InputProps === next.InputProps && prev.items === next.items && prev.onChange === next.onChange;
};

var testValue$1 = function testValue(prev, next) {
  return prev.name === next.name && prev.value === next.value && prev.error === next.error && prev.disabled === next.disabled && prev.InputProps === next.InputProps && prev.items === next.items && prev.onChange === next.onChange;
};

var arePropsEqual$4 = function arePropsEqual(prev, next) {
  if (prev.name && next.name) {
    return testName$1(prev, next);
  }

  return testValue$1(prev, next);
};

var index$5 = React.memo(FormSelect, arePropsEqual$4);

function FormSelectWithSearch(_ref) {
  var name = _ref.name,
      label = _ref.label,
      placeholder = _ref.placeholder,
      labelHelper = _ref.labelHelper,
      value = _ref.value,
      onChange = _ref.onChange,
      error = _ref.error,
      disabled = _ref.disabled,
      options = _ref.options,
      _ref$labelColor = _ref.labelColor,
      labelColor = _ref$labelColor === void 0 ? colors.textSecondary : _ref$labelColor,
      _ref$helperColor = _ref.helperColor,
      helperColor = _ref$helperColor === void 0 ? colors.red : _ref$helperColor,
      _ref$required = _ref.required,
      required = _ref$required === void 0 ? false : _ref$required,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur,
      getOptionLabel = _ref.getOptionLabel,
      noOptionsText = _ref.noOptionsText;
  return React__default.createElement(BoxInput, null, React__default.createElement(core.Box, {
    display: "flex",
    flexDirection: "row"
  }, React__default.createElement(core.Typography, {
    title: label,
    variant: "h6"
  }, label), required && React__default.createElement(Required, null, "*"), labelHelper && React__default.createElement(LabelHelper, {
    labelcolor: labelColor,
    title: labelHelper
  }, "( ", labelHelper, " )")), React__default.createElement(lab.Autocomplete, _extends({
    getOptionLabel: getOptionLabel ? getOptionLabel : function () {
    },
    options: options,
    disabled: disabled,
    onChange: onChange,
    onFocus: onFocus,
    onBlur: onBlur,
    value: value,
    noOptionsText: noOptionsText
  }, name, {
    style: {
      padding: '0px !important',
      paddingRight: '62px !important',
      height: 40
    },
    renderInput: function renderInput(params) {
      return React__default.createElement(InputSelectSearch, _extends({}, params, {
        placeholder: placeholder,
        error: error,
        variant: "outlined",
        margin: "dense",
        fullwidth: true
      }));
    }
  })), error && React__default.createElement(Helper$1, {
    helpercolor: helperColor
  }, error));
}

var testName$2 = function testName(prev, next) {
  return prev.name.value === next.name.value && prev.value === next.value && prev.error === next.error && prev.disabled === next.disabled && prev.options === next.options && prev.onChange === next.onChange;
};

var testValue$2 = function testValue(prev, next) {
  return prev.name === next.name && prev.value === next.value && prev.error === next.error && prev.disabled === next.disabled && prev.options === next.options && prev.onChange === next.onChange;
};

var arePropsEqual$5 = function arePropsEqual(prev, next) {
  if (prev.name && next.name) {
    return testName$2(prev, next);
  }

  return testValue$2(prev, next);
};

var index$6 = React.memo(FormSelectWithSearch, arePropsEqual$5);

function _templateObject$4() {
  var data = _taggedTemplateLiteral(["\n border: 1px solid ", " !important\n"]);

  _templateObject$4 = function _templateObject() {
    return data;
  };

  return data;
}
var NewIframe = styled(Iframe)(_templateObject$4(), function (props) {
  return props.bordercolor;
});

/* eslint-disable no-restricted-globals */

function IframeContent(_ref) {
  var url = _ref.url,
      _ref$borderColor = _ref.borderColor,
      borderColor = _ref$borderColor === void 0 ? colors.border : _ref$borderColor,
      titleOpen = _ref.titleOpen;

  var openNewWindow = function openNewWindow() {
    window.open(url, '', "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=".concat(screen.availWidth, ",height=").concat(screen.availHeight));
  };

  return React__default.createElement(React.Fragment, null, React__default.createElement(core.Box, {
    display: "flex",
    justifyContent: "flex-end"
  }, React__default.createElement(core.IconButton, {
    title: titleOpen,
    onClick: openNewWindow
  }, React__default.createElement(icons.OpenInNew, null))), React__default.createElement(NewIframe, {
    bordercolor: borderColor,
    url: url,
    width: "100%",
    height: "90%",
    display: "initial",
    position: "relative"
  }));
}

var index$7 = React.memo(IframeContent);

function _templateObject$5() {
  var data = _taggedTemplateLiteral(["\n  margin: 8px !important\n  width:20px !important\n  height:20px !important\n  margin-right:16px !important \n"]);

  _templateObject$5 = function _templateObject() {
    return data;
  };

  return data;
}
var LoaderMUI = styled(core.CircularProgress)(_templateObject$5());

function Loader(_ref) {
  var _ref$open = _ref.open,
      open = _ref$open === void 0 ? false : _ref$open,
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? '' : _ref$message;
  return React__default.createElement(core.Dialog, {
    open: open
  }, React__default.createElement(core.DialogTitle, null, React__default.createElement(LoaderMUI, null), message, "..."));
}

var index$8 = React.memo(Loader);

function _templateObject3$1() {
  var data = _taggedTemplateLiteral(["\n  padding: 8px !important\n"]);

  _templateObject3$1 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$2() {
  var data = _taggedTemplateLiteral(["\n  line-height: 30px !important\n"]);

  _templateObject2$2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$6() {
  var data = _taggedTemplateLiteral(["\n  padding: 8px !important\n"]);

  _templateObject$6 = function _templateObject() {
    return data;
  };

  return data;
}
var TitleModal = styled(core.DialogTitle)(_templateObject$6());
var TextTitleModal = styled(core.Typography)(_templateObject2$2());
var ContentModal = styled(core.DialogContent)(_templateObject3$1());

function Modal(_ref) {
  var open = _ref.open,
      handleClose = _ref.handleClose,
      title = _ref.title,
      componentSubtitle = _ref.componentSubtitle,
      children = _ref.children,
      onClickButton = _ref.onClickButton,
      textButton = _ref.textButton,
      titleFechar = _ref.titleFechar,
      maxWidth = _ref.maxWidth,
      fullWidth = _ref.fullWidth;
  return React__default.createElement(core.Dialog, {
    open: open,
    onClose: handleClose,
    maxWidth: maxWidth,
    fullWidth: fullWidth
  }, React__default.createElement(TitleModal, null, React__default.createElement(core.Box, {
    display: "flex",
    flexDirection: "row"
  }, React__default.createElement(core.Box, {
    flexGrow: 1
  }, React__default.createElement(TextTitleModal, {
    title: title,
    variant: "h5"
  }, title)), React__default.createElement(core.Box, {
    alignSelf: "flex-end"
  }, React__default.createElement(core.IconButton, {
    size: "small",
    title: titleFechar,
    onClick: handleClose
  }, React__default.createElement(icons.Close, null)))), componentSubtitle && React__default.createElement(core.Box, {
    display: "flex",
    flexDirection: "row"
  }, React__default.createElement(core.Box, {
    flexGrow: 1
  }, componentSubtitle))), children && React__default.createElement(ContentModal, null, children), React__default.createElement(core.DialogActions, null, React__default.createElement(Button$1, {
    onClick: onClickButton,
    color: "primary",
    text: textButton
  })));
}

var index$9 = React.memo(Modal);

function _templateObject2$3() {
  var data = _taggedTemplateLiteral(["\nwidth: 100%\n"]);

  _templateObject2$3 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$7() {
  var data = _taggedTemplateLiteral(["\ndisplay: flex\njustify-content: flex-end\nwidth: ", "px\nborder-radius: 4px !important\nborder: 1px solid ", "\npadding-left: 16px\n"]);

  _templateObject$7 = function _templateObject() {
    return data;
  };

  return data;
}
var SearchBox = styled(core.Box)(_templateObject$7(), function (props) {
  return props.width;
}, colors.border);
var InputSearch = styled(core.InputBase)(_templateObject2$3());

function Search(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === void 0 ? '100%' : _ref$width,
      small = _ref.small,
      placeholder = _ref.placeholder,
      onChange = _ref.onChange,
      onClick = _ref.onClick,
      titleSearch = _ref.titleSearch;
  return React__default.createElement(SearchBox, {
    width: width
  }, React__default.createElement(InputSearch, {
    title: placeholder,
    placeholder: placeholder,
    onChange: onChange
  }), React__default.createElement(core.IconButton, {
    size: small ? 'small' : 'medium',
    "aria-label": "Search",
    title: titleSearch,
    onClick: onClick
  }, React__default.createElement(SearchIcon, null)));
}

var index$a = React.memo(Search);

function _templateObject$8() {
  var data = _taggedTemplateLiteral(["\n  border: 1px solid ", "\n  box-shadow: none !important\n  margin-top: 16px !important\n  margin-bottom: 16px !important\n\n"]);

  _templateObject$8 = function _templateObject() {
    return data;
  };

  return data;
}
var ContentTable = styled(core.Paper)(_templateObject$8(), colors.border);

function Table(_ref) {
  var children = _ref.children,
      small = _ref.small;
  return React__default.createElement(ContentTable, null, React__default.createElement(core.Table, {
    size: small ? 'small' : 'medium'
  }, children));
}

var index$b = React.memo(Table);

function _templateObject$9() {
  var data = _taggedTemplateLiteral(["\n  padding: ", "px !important\n  margin: 4px\n  width:", " !important\n"]);

  _templateObject$9 = function _templateObject() {
    return data;
  };

  return data;
}
var TableCell = styled(core.TableCell)(_templateObject$9(), function (props) {
  return props.padding ? props.padding : 4;
}, function (props) {
  return props.width;
});

function TableCell$1(_ref) {
  var title = _ref.title,
      label = _ref.label,
      align = _ref.align,
      colSpan = _ref.colSpan,
      padding = _ref.padding,
      width = _ref.width;
  return React__default.createElement(TableCell, {
    title: title || label,
    align: align,
    colSpan: colSpan,
    padding: padding,
    width: width
  }, label);
}

var arePropsEqual$6 = function arePropsEqual(prev, next) {
  return prev.label === next.label;
};

var TableCell$2 = React.memo(TableCell$1, arePropsEqual$6);

function _templateObject$a() {
  var data = _taggedTemplateLiteral(["\n  background-color: ", "\n"]);

  _templateObject$a = function _templateObject() {
    return data;
  };

  return data;
}
var TableRow = styled(core.TableRow)(_templateObject$a(), function (props) {
  return props.backgroundcolor;
});

function TableRow$1(_ref) {
  var children = _ref.children,
      onClick = _ref.onClick,
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? colors.tableRowPrimary : _ref$backgroundColor;
  return React__default.createElement(TableRow, {
    backgroundcolor: backgroundColor,
    onClick: onClick
  }, children);
}

var TableRow$2 = React.memo(TableRow$1);

function TableHead(_ref) {
  var order = _ref.order,
      orderBy = _ref.orderBy,
      onRequestSort = _ref.onRequestSort,
      columns = _ref.columns;

  var createSortHandler = function createSortHandler(property) {
    return function (event) {
      onRequestSort(event, property);
    };
  };

  return React__default.createElement(core.TableHead, null, React__default.createElement(TableRow$2, {
    backgroundColor: colors.tableHead
  }, columns.map(function (column, index) {
    return React__default.createElement(TableCell$2, {
      key: index,
      align: column.align ? column.align : 'left',
      padding: column.padding,
      width: column.width,
      title: column.title ? column.title : column.label,
      colSpan: column.colSpan ? column.colSpan : 1,
      label: React__default.createElement(React.Fragment, null, onRequestSort && React__default.createElement(core.TableSortLabel, {
        active: orderBy === column.id,
        direction: order,
        onClick: createSortHandler(column.id)
      }, column.label), !onRequestSort && column.label)
    });
  })));
}

var arePropsEqual$7 = function arePropsEqual(prev, next) {
  return prev.columns.length === next.columns.length && prev.order === next.order && prev.orderBy === next.orderBy;
};

var index$c = React.memo(TableHead, arePropsEqual$7);

function _templateObject$b() {
  var data = _taggedTemplateLiteral(["\n  color:", " !important\n  font-weight:", " !important\n  font-size:12px !important\n"]);

  _templateObject$b = function _templateObject() {
    return data;
  };

  return data;
}
var Label = styled(core.Typography)(_templateObject$b(), function (props) {
  return props.active ? props.primary : props.secondary;
}, function (props) {
  return props.active ? '600' : '400';
});

function Steppers(_ref) {
  var steps = _ref.steps,
      primary = _ref.primary,
      secondary = _ref.secondary,
      activeStep = _ref.activeStep,
      _onClick = _ref.onClick;
  return React__default.createElement(core.Stepper, {
    alternativeLabel: true,
    nonLinear: true,
    activeStep: activeStep
  }, steps.map(function (step, index) {
    var stepProps = {};
    var buttonProps = {};
    return React__default.createElement(core.Step, _extends({
      key: step.value
    }, stepProps), React__default.createElement(core.StepButton, _extends({
      icon: step.Codigo,
      onClick: function onClick() {
        return _onClick(step.value, index);
      },
      completed: step.completed
    }, buttonProps), React__default.createElement(Label, {
      primary: primary,
      secondary: secondary,
      title: step.Title,
      active: index === activeStep
    }, step.label)));
  }));
}

var index$d = React.memo(Steppers);

function _templateObject$c() {
  var data = _taggedTemplateLiteral(["\nwidth: 48px\nheight: 48px \nalign-self: center\n"]);

  _templateObject$c = function _templateObject() {
    return data;
  };

  return data;
}
var ButtonIconCarrocel = styled(core.IconButton)(_templateObject$c());

function Carrocel(_ref) {
  var children = _ref.children,
      anterior = _ref.anterior,
      proximo = _ref.proximo,
      visibleAnterior = _ref.visibleAnterior,
      visibleProximo = _ref.visibleProximo;
  return React__default.createElement(core.Box, {
    display: "flex",
    justifyContent: "space-between"
  }, visibleAnterior && React__default.createElement(ButtonIconCarrocel, {
    onClick: anterior
  }, React__default.createElement(icons.NavigateBefore, null)), children, visibleProximo && React__default.createElement(ButtonIconCarrocel, {
    onClick: proximo
  }, React__default.createElement(icons.NavigateNext, null)));
}

var index$e = React.memo(Carrocel);

function not(a, b) {
  return a.filter(function (value) {
    return b.indexOf(value) === -1;
  });
}

function intersection(a, b) {
  return a.filter(function (value) {
    return b.indexOf(value) !== -1;
  });
}

function union(a, b) {
  return [].concat(_toConsumableArray(a), _toConsumableArray(not(b, a)));
}

function TransferList(_ref) {
  var escolhidos = _ref.escolhidos,
      setEscolhidos = _ref.setEscolhidos,
      naoPertencentes = _ref.naoPertencentes,
      setNaoPertencentes = _ref.setNaoPertencentes,
      pertencentes = _ref.pertencentes,
      setPertencentes = _ref.setPertencentes;
  var naoPertencentesEscolhidos = intersection(escolhidos, naoPertencentes);
  var pertencentesEscolhidos = intersection(escolhidos, pertencentes);

  var handleToggle = function handleToggle(value) {
    return function () {
      var currentIndex = escolhidos.indexOf(value);

      var newEscolhidos = _toConsumableArray(escolhidos);

      if (currentIndex === -1) {
        newEscolhidos.push(value);
      } else {
        newEscolhidos.splice(currentIndex, 1);
      }

      setEscolhidos(newEscolhidos);
    };
  };

  var numberOfChecked = function numberOfChecked(items) {
    return intersection(escolhidos, items).length;
  };

  var handleToggleAll = function handleToggleAll(items) {
    return function () {
      if (numberOfChecked(items) === items.length) {
        setEscolhidos(not(escolhidos, items));
      } else {
        setEscolhidos(union(escolhidos, items));
      }
    };
  };

  var handleCheckedPertencentes = function handleCheckedPertencentes() {
    setEscolhidos(not(escolhidos, naoPertencentesEscolhidos));
    setNaoPertencentes(not(naoPertencentes, naoPertencentesEscolhidos));
    setPertencentes(pertencentes.concat(naoPertencentesEscolhidos));
  };

  var handleCheckedNaoPertencentes = function handleCheckedNaoPertencentes() {
    setEscolhidos(not(escolhidos, pertencentesEscolhidos));
    setPertencentes(not(pertencentes, pertencentesEscolhidos));
    setNaoPertencentes(naoPertencentes.concat(pertencentesEscolhidos));
  };

  var customList = function customList(title, items) {
    return React__default.createElement(Card$1, null, React__default.createElement(core.CardHeader, {
      avatar: React__default.createElement(core.Checkbox, {
        onClick: handleToggleAll(items),
        checked: numberOfChecked(items) === items.length && items.length !== 0,
        indeterminate: numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0,
        disabled: items.length === 0,
        inputProps: {
          'aria-label': 'all items selected'
        }
      }),
      title: title,
      subheader: "".concat(numberOfChecked(items), "/").concat(items.length, " selecionados")
    }), React__default.createElement(core.Divider, null), React__default.createElement(core.List, {
      dense: true,
      style: {
        flexGrow: 1,
        position: 'relative',
        overflow: 'auto',
        height: 300,
        width: '100%'
      },
      component: "div",
      role: "list"
    }, items.map(function (value, index) {
      var labelId = "transfer-list-all-item-".concat(value, "-label");
      return React__default.createElement(core.ListItem, {
        key: index,
        role: "listitem",
        button: true,
        onClick: handleToggle(value)
      }, React__default.createElement(core.ListItemIcon, null, React__default.createElement(core.Checkbox, {
        checked: escolhidos.indexOf(value) !== -1,
        tabIndex: -1,
        disableRipple: true,
        inputProps: {
          'aria-labelledby': labelId
        }
      })), React__default.createElement(core.ListItemText, {
        id: labelId,
        primary: value.Nome
      }));
    }), React__default.createElement(core.ListItem, null)));
  };

  return React__default.createElement(core.Grid, {
    container: true,
    spacing: 3,
    justify: "center",
    style: {
      flexGrow: 1,
      display: 'flex',
      paddingBottom: 16
    },
    alignItems: "center"
  }, React__default.createElement(core.Grid, {
    item: true,
    style: {
      flexGrow: 1
    }
  }, customList('Não relacionados', naoPertencentes)), React__default.createElement(core.Grid, {
    item: true
  }, React__default.createElement(core.Grid, {
    container: true,
    direction: "column",
    alignItems: "center"
  }, React__default.createElement(core.Button, {
    variant: "outlined",
    size: "small",
    onClick: handleCheckedPertencentes,
    disabled: naoPertencentesEscolhidos.length === 0,
    "aria-label": "move selected right"
  }, ">"), React__default.createElement(core.Button, {
    variant: "outlined",
    size: "small",
    onClick: handleCheckedNaoPertencentes,
    disabled: pertencentesEscolhidos.length === 0,
    "aria-label": "move selected left"
  }, "<"))), React__default.createElement(core.Grid, {
    item: true,
    style: {
      flexGrow: 1
    }
  }, customList('Relacionados', pertencentes)));
}

function arePropsEqual$8(prev, next) {
  return prev.escolhidos === next.escolhidos && prev.naoPertencentes === next.naoPertencentes && prev.pertencentes === next.pertencentes;
}

var index$f = React.memo(TransferList, arePropsEqual$8);

exports.Button = Button$1;
exports.Card = Card$1;
exports.Confirm = index;
exports.ExportXLSL = index$1;
exports.FloatButton = index$2;
exports.FormInput = index$3;
exports.FormInputFile = index$4;
exports.FormSelect = index$5;
exports.FormSelectWithSearch = index$6;
exports.IframeContent = index$7;
exports.Loader = index$8;
exports.Modal = index$9;
exports.Search = index$a;
exports.Table = index$b;
exports.TableCell = TableCell$2;
exports.TableHead = index$c;
exports.TableRow = TableRow$2;
exports.Steppers = index$d;
exports.Carrocel = index$e;
exports.TransferList = index$f;
