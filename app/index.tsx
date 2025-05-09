import React, { useEffect } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to the SigninScreen
  return <Redirect href="/screens/SigninScreen" />;
}