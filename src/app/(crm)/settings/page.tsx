"use client";

import React, { useState } from 'react';
import styles from './settings.module.css';
import { Settings, Users, CheckSquare, FileText, BarChart3, Bell, UserPlus } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'contracts', label: 'Contracts', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <>
            <h2 className={styles.sectionTitle}>General Settings</h2>
            <div className={styles.formGrid}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Company Name</label>
                  <input type="text" className={styles.input} defaultValue="Tagverse.io" />
                </div>
                <div className={styles.formGroup}>
                  <label>Industry</label>
                  <select className={`${styles.input} ${styles.select}`}>
                    <option>Technology</option>
                    <option>Real Estate</option>
                    <option>Finance</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Timezone</label>
                  <select className={`${styles.input} ${styles.select}`}>
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Theme Preference</label>
                  <select className={`${styles.input} ${styles.select}`}>
                    <option>System Default</option>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
              </div>
              <button className={styles.saveButton}>Save Changes</button>
            </div>
          </>
        );

      case 'team':
        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h2 className={styles.sectionTitle} style={{ borderBottom: 'none', paddingBottom: 0 }}>Team Members</h2>
              <button className={styles.addUserBtn}>
                <UserPlus size={16} /> Add Member
              </button>
            </div>
            <div className={styles.userList}>
              {[
                { name: 'Alice Smith', email: 'alice@tagverse.com', role: 'Admin', initials: 'AS' },
                { name: 'Bob Jones', email: 'bob@tagverse.com', role: 'Manager', initials: 'BJ' },
                { name: 'Charlie Davis', email: 'charlie@tagverse.com', role: 'Sales Rep', initials: 'CD' }
              ].map((user, idx) => (
                <div key={idx} className={styles.userCard}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>{user.initials}</div>
                    <div>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                  <div className={styles.userRole}>{user.role}</div>
                </div>
              ))}
            </div>
          </>
        );

      case 'tasks':
        return (
          <>
            <h2 className={styles.sectionTitle}>Task Preferences</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Default Task View</label>
                <p>Choose how tasks are displayed when you first open the Tasks module.</p>
                <select className={`${styles.input} ${styles.select}`} style={{ width: '300px', marginTop: '8px' }}>
                  <option>List View</option>
                  <option>Timeline View</option>
                  <option>Heatmap View</option>
                </select>
              </div>

              <div className={styles.switchContainer}>
                <div className={styles.switchInfo}>
                  <span className={styles.switchTitle}>Auto-prioritize tasks</span>
                  <span className={styles.switchDesc}>Allow the system to suggest task priorities based on deadlines and health.</span>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <button className={styles.saveButton}>Save Preferences</button>
            </div>
          </>
        );

      case 'contracts':
        return (
          <>
            <h2 className={styles.sectionTitle}>Contract Settings</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Default Contract Template</label>
                <p>Select the standard template used for new contracts.</p>
                <select className={`${styles.input} ${styles.select}`} style={{ width: '300px', marginTop: '8px' }}>
                  <option>Standard NDA v2</option>
                  <option>Master Service Agreement</option>
                  <option>Employment Contract</option>
                </select>
              </div>

              <div className={styles.switchContainer}>
                <div className={styles.switchInfo}>
                  <span className={styles.switchTitle}>Require Manager Approval</span>
                  <span className={styles.switchDesc}>Contracts exceeding $10,000 require secondary approval before sending.</span>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <button className={styles.saveButton}>Save Settings</button>
            </div>
          </>
        );

      case 'analytics':
        return (
          <>
            <h2 className={styles.sectionTitle}>Analytics Dashboard</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Primary Metric</label>
                <p>The main metric displayed on your dashboard overview.</p>
                <select className={`${styles.input} ${styles.select}`} style={{ width: '300px', marginTop: '8px' }}>
                  <option>Total Revenue</option>
                  <option>Active Contracts</option>
                  <option>Task Completion Rate</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Date Range Default</label>
                <select className={`${styles.input} ${styles.select}`} style={{ width: '300px' }}>
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>Year to Date</option>
                </select>
              </div>
              <button className={styles.saveButton}>Update Analytics</button>
            </div>
          </>
        );

      case 'notifications':
        return (
          <>
            <h2 className={styles.sectionTitle}>Notification Preferences</h2>
            <div className={styles.formGrid}>
              <div className={styles.switchContainer}>
                <div className={styles.switchInfo}>
                  <span className={styles.switchTitle}>Email Notifications</span>
                  <span className={styles.switchDesc}>Receive a daily summary of tasks and contract updates via email.</span>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.switchContainer}>
                <div className={styles.switchInfo}>
                  <span className={styles.switchTitle}>In-App Alerts</span>
                  <span className={styles.switchDesc}>Show toast notifications when you are mentioned or assigned a task.</span>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account, team, and workspace preferences.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className={styles.navIcon} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
