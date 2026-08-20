import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  ha-card {
    overflow: visible;
    border-radius: 12px;
  }
  .accent {
    height: 4px;
    background: #d71920;
    border-radius: 12px 12px 0 0;
  }
  header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 16px 12px;
  }
  .brand {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    background: #d71920;
    color: white;
    font-size: 20px;
  }
  h2 {
    font-size: 20px;
    line-height: 1.25;
    margin: 0;
    font-weight: 500;
  }
  .eyebrow,
  .muted {
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .head-copy {
    flex: 1;
    min-width: 0;
  }
  .picker-wrap,
  .typeahead {
    padding: 0 16px 14px;
  }
  select,
  input {
    box-sizing: border-box;
    color: inherit;
    font: inherit;
    background: var(--card-background-color, white);
  }
  select {
    width: 100%;
    height: 44px;
    padding: 0 10px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
  }
  .typeahead {
    position: relative;
    z-index: 1;
  }
  form {
    display: flex;
    gap: 8px;
  }
  input {
    min-width: 0;
    flex: 1;
    height: 46px;
    padding: 0 12px;
    border: 1px solid var(--secondary-text-color);
    border-radius: 6px;
  }
  input:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: -1px;
    border-color: var(--primary-color);
  }
  button {
    min-height: 44px;
    cursor: pointer;
    color: inherit;
    font: inherit;
  }
  .add {
    min-width: 76px;
    border: 0;
    border-radius: 6px;
    background: var(--primary-color, #006da5);
    color: var(--text-primary-color, white);
    font-weight: 500;
  }
  .add:disabled {
    cursor: default;
    opacity: 0.55;
  }
  .popup {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 61px;
    max-height: 260px;
    overflow: auto;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color, white);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  .popup-head {
    padding: 10px 12px 6px;
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .option {
    width: 100%;
    min-height: 52px;
    padding: 8px 12px;
    border: 0;
    border-top: 1px solid var(--divider-color);
    text-align: left;
    background: transparent;
  }
  .option:hover,
  .option.active {
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
  }
  .option-primary,
  .option-secondary {
    display: block;
  }
  .option-secondary {
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .message {
    margin-top: 8px;
    padding: 10px 12px;
    border-left: 3px solid var(--primary-color);
    border-radius: 4px;
    background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    font-size: 13px;
  }
  .message.error {
    border-color: var(--error-color, #b3261e);
    background: color-mix(in srgb, var(--error-color, #b3261e) 8%, transparent);
  }
  .deselect {
    min-height: 38px;
    margin-top: 8px;
    padding: 0 12px;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    background: transparent;
    color: var(--primary-color);
  }
  .section {
    border-top: 1px solid var(--divider-color);
  }
  .section-heading {
    display: flex;
    justify-content: space-between;
    padding: 14px 16px 7px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 52px;
    padding: 0 8px 0 12px;
    border-top: 1px solid var(--divider-color);
  }
  .row .summary {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .row.completed .summary {
    color: var(--secondary-text-color);
    text-decoration: line-through;
  }
  .check,
  .icon {
    width: 44px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    font-size: 20px;
  }
  .icon {
    color: var(--secondary-text-color);
  }
  .empty,
  .status {
    padding: 16px;
    color: var(--secondary-text-color);
    text-align: center;
  }
  .edit-form {
    width: 100%;
    padding: 6px 0;
  }
  .edit-form input {
    height: 40px;
  }
  .edit-form button {
    min-height: 40px;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @media (max-width: 420px) {
    header {
      padding: 14px 12px 10px;
    }
    .picker-wrap,
    .typeahead {
      padding-left: 12px;
      padding-right: 12px;
    }
    .popup {
      left: 12px;
      right: 12px;
    }
    .row {
      min-height: 56px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      scroll-behavior: auto !important;
      transition: none !important;
    }
  }
`;
