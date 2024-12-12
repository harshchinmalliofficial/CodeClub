// import React from "react";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

export function Loader({ className, ...props }) {
  return <Loader2 className={`animate-spin ${className}`} {...props} />;
}

Loader.propTypes = {
  className: PropTypes.string,
};
