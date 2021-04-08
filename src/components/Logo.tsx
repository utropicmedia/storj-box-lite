import cn from "classnames";
import React, { ReactElement } from "react";

export type LogoColor = "brand" | "contrast";

export interface LogoProperties {
  color?: LogoColor;
}

export default function Logo({ color }: LogoProperties): ReactElement {
  const classes = cn("h-full ", {
    "fill-current text-current": !color,
    "fill-brand text-brand": color === "brand",
    "fill-brand=contrast text-brand-contrast": color === "contrast",
  });
  return (
    <svg viewBox="0 0 1688 666" className={classes}>
      <path d="M234.466 426.949l.518-.002.131.002h44.103c.009 3.147.013 5.009.012 5.584-.099 44.895-.09 89.779-.009 134.67.003 3.17-.995 4.973-3.886 6.355-15.142 7.292-26.569 26.107-23.451 46.23 3.616 23.378 27.657 41.032 50.858 36.499 20.438-3.987 33.865-17.928 36.74-39.374 1.946-14.545-5.057-33.746-23.78-43.36-2.54-1.297-3.943-2.715-3.934-5.833.093-43.605.102-87.21 0-130.807v-9.964h54.554a31.67 31.67 0 005.013-.4c12.43-1.269 23.954-5.504 33.819-11.97l77.451 44.822c2.552 1.723 4.516 2.975 5.894 3.757 3.85 2.177 5.336 4.583 5.222 9.086-.687 26.093 22.086 47.407 48.637 44.58 26.067-2.769 44.536-27.834 38.49-53.18-7.249-30.374-40.182-44.08-66.784-27.662-2.804 1.726-4.83 2.198-7.822.448-22.51-13.139-45.074-26.188-67.73-39.073-.788-.447-4.253-2.645-10.395-6.593a71.746 71.746 0 0010.29-37.101c0-26.88-14.72-50.209-36.562-62.96l.282-.163c.379-.285.813-.566 1.305-.848 9.58-5.481 19.157-10.97 28.73-16.467l63.618-36.676c3.517-2.035 7.033-4.072 10.549-6.11 2.758-1.59 4.63-1.618 7.338.198 9.651 6.47 20.471 8.52 31.824 6.533 22.097-3.87 38.112-23.846 36.143-47.427-2.144-25.582-27.26-44.704-52.347-39.156-22.014 4.87-35.844 22.058-35.59 44.653.036 3.85-1.034 6.044-4.471 8.009-8.87 5.07-17.734 10.148-26.592 15.235l.006.01-81.09 46.922c-14.29-25.006-39.79-42.999-69.715-47.7.009-38.014.082-76.029-.123-114.04-.03-5.704 1.303-9.01 6.653-12.079 19.18-11.01 26.47-34.71 17.695-54.92-8.85-20.385-31.46-31.275-52.663-24.822-19.3 5.873-30.058 19.493-31.95 39.314-1.455 15.295 5.787 32.285 23.26 41.826 2.685 1.463 4.556 2.75 4.544 6.429-.036 11.189-.062 22.378-.08 33.566l.646 84.858c-26.529 4.396-49.913 19.299-64.737 40.9a88.992 88.992 0 00-11.095 3.204c-33.405-19.07-66.662-38.407-100.126-57.386-5.018-2.843-7.44-5.892-6.603-11.667.335-2.302-.376-4.769-.753-7.14-3.428-21.586-24.56-39.642-50.069-35.456-25.024 4.115-40.913 26.737-36.782 50.951 5.266 30.924 40.59 46.577 67.24 29.66 3.007-1.908 5.088-2.057 8.17-.262 6.328 3.687 15.952 8.991 28.873 15.912l59.35 34.274c-16.288 15.423-26.442 36.978-26.442 60.962 0 18.538 6.064 35.62 16.334 49.54l-69.14 39.86c-4.504 2.353-7.875 4.166-10.114 5.439-1.501.85-4.415.675-5.94-.245-7.17-4.324-14.807-7.197-23.164-7.42-27.804-.711-44.713 21.977-45.663 41.688-1.1 23.088 16.385 46.737 44.664 46.525 24.8-.185 43.673-20.05 43.427-44.838-.038-4.428 1.265-6.934 5.154-9.14 19.103-10.867 47.619-27.28 85.548-49.241 13.51 8.234 29.474 12.98 46.517 12.98zm330.288-186.81c-3.229 1.927-4.349 3.89-4.34 7.567.11 56.92.102 113.844.015 170.753-.006 3.42.866 5.482 4.005 7.287 20.237 11.686 30.478 33.24 26.843 55.9-3.485 21.713-20.855 39.55-43.355 43.82-13.045 2.486-25.681.507-37.114-6.503-3.485-2.13-5.94-1.755-9.207.125a45120.2 45120.2 0 01-147.074 84.775c-3.356 1.931-4.614 4.05-4.605 7.965.051 27.386-21.102 51.218-47.527 53.874-28.145 2.838-53.029-14.835-59.11-42.125-.93-4.196-1.245-8.583-1.34-12.877-.072-2.91-.878-4.691-3.467-6.19a77120.963 77120.963 0 01-149.17-85.98c-2.691-1.566-4.806-1.578-7.52.063-32.473 19.532-73.86.809-80.747-35.679-4.345-23.05 5.044-44.602 25.69-56.741 3.261-1.925 4.737-3.862 4.73-7.846-.149-56.926-.125-113.84-.035-170.758.003-3.42-.887-5.443-4.02-7.26C6.68 228.278-3.071 207.377.91 183.91c3.954-23.312 21.995-40.415 45.475-43.757 12.585-1.788 24.723.504 35.611 7.451 2.53 1.618 4.409 1.567 6.983.084a59387.7 59387.7 0 01148.764-85.727c3.001-1.725 4.172-3.703 4.181-7.237.08-31.348 24.872-55.347 56.284-54.712 24.483.49 47.393 20.684 50.866 44.826.317 2.22.815 3.587.815 6.643 0 6.693 2.467 9.531 7.682 12.51 48.154 27.532 96.174 55.279 144.161 83.073 3.298 1.916 5.693 1.994 9.127.048 32.595-18.577 72.115-.773 80.05 35.986.747 3.42.676 7.02.935 10.144-.534 20.865-9.598 36.416-27.09 46.896zM526 472.434c0-7.212 5.181-12.45 12.277-12.435 6.832.036 12.654 5.674 12.722 12.349.075 6.425-6.146 12.64-12.621 12.651-6.933 0-12.375-5.52-12.378-12.565zM283 54.395c.027-6.993 5.475-12.389 12.515-12.395 7.052-.006 12.458 5.379 12.485 12.398.018 6.732-5.855 12.684-12.461 12.601-6.717-.065-12.56-5.946-12.539-12.603zM66 472.486c-.027 7.04-5.52 12.571-12.421 12.515-6.521-.063-12.55-6.14-12.579-12.702C40.967 465.742 46.933 460 53.778 460c7.091.006 12.249 5.27 12.222 12.485zM295.653 600c7.035.049 12.38 5.513 12.347 12.624-.045 7.085-5.47 12.421-12.6 12.376-7.07-.037-12.476-5.54-12.4-12.63.081-7.051 5.592-12.424 12.653-12.37zM53.918 206c-7.129.063-12.701-5.244-12.912-12.28-.211-6.859 5.427-12.615 12.454-12.718 7.337-.112 12.434 4.882 12.538 12.271.11 7.425-4.865 12.66-12.08 12.726zm484.215 0c-7.209-.052-12.204-5.294-12.132-12.716.071-7.369 5.185-12.38 12.524-12.283 7.037.1 12.638 5.803 12.471 12.695-.166 6.983-5.779 12.355-12.863 12.304zM235.011 396C203.525 396 178 371.43 178 341.122c0-30.186 25.319-54.68 56.63-54.877C244.65 262.628 268.614 246 296.583 246c36.669 0 66.454 28.581 66.959 64.025h.115c24.49 0 44.342 19.246 44.342 42.987 0 22.653-18.073 41.213-41.003 42.868a1.16 1.16 0 01-.515.12H235.659c-.027 0-.053 0-.08-.003-.189.003-.378.003-.568.003zM1639.24 274.097h-69.852v-47.549h117.807v139.17c0 51.656-30.351 76.572-75.27 76.572-33.083 0-54.936-14.585-69.505-31.905l29.44-32.817c12.141 13.37 23.978 21.27 38.85 21.27 17.604 0 28.53-10.635 28.53-35.248v-89.493zM851.194 376.413c0 42.198-32.182 65.877-78.025 65.877-32.182 0-64.667-11.232-90.169-34.001l27.627-33.09c19.127 15.786 39.165 25.804 63.453 25.804 19.126 0 30.663-7.59 30.663-20.037v-.607c0-11.84-7.286-17.911-42.807-27.019-42.808-10.929-70.435-22.769-70.435-64.967v-.607c0-38.555 30.967-64.056 74.381-64.056 30.967 0 57.38 9.714 78.936 27.019l-24.288 35.215c-18.823-13.054-37.343-20.947-55.255-20.947s-27.324 8.197-27.324 18.519v.607c0 13.965 9.108 18.519 45.844 27.93 43.11 11.232 67.399 26.715 67.399 63.752v.608zm198.71-106.676h-64.635v169.715h-46.731V269.737h-64.635v-43.189h176v43.19zM1295.451 333c0 60.47-47.773 110-113.498 110-65.726 0-112.89-48.923-112.89-109.392V333c0-60.47 47.773-110 113.498-110 65.726 0 112.89 48.923 112.89 109.392V333zm-48.968.606V333c0-36.387-26.786-66.71-64.53-66.71s-63.922 29.716-63.922 66.104V333c0 36.387 26.786 66.71 64.53 66.71 37.745 0 63.922-29.716 63.922-66.104zM1519 439.452h-54.686l-45.572-68.13h-36.761v68.13h-46.787V226.548h97.22c50.129 0 80.206 26.461 80.206 70.258v.609c0 34.368-18.533 55.963-45.572 66L1519 439.452zM1465.065 300.1v-.608c0-20.04-13.94-30.364-36.668-30.364h-46.365v61.032h47.274c22.728 0 35.759-12.145 35.759-30.06z" />
    </svg>
  );
}
