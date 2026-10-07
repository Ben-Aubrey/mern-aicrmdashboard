import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Lead } from "./models/Lead.js";
import { Contact } from "./models/Contact.js";
import { Note } from "./models/Note.js";
import { Task } from "./models/Task.js";

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY);
const daysAhead = (n) => new Date(Date.now() + n * DAY);
const rand = (a, b) => arr[Math.floor(Math.random() * arr.length)];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickSome = (arr, n) => 
    [...arr].sort(() => Math.rand() - 0.5).slice(0, n);
const weighted = (pairs) => {
    const total = pairs.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * total;
    for (const [v, w] of pairs) {
        if ((r -= w) <= 0) return v;
    }
    return pairs[0][0];
};
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const COMPANIES = [
    ["Acme Corp", "acmecorp.com"], ["Globex", "globex.io"], ["Initech", "initech.com"],
    ["Umbrella Co", "umbrella.co"], ["Soylent", "soylent.io"], ["Hooli", "hooli.com"],
    ["Pied Piper", "piedpiper.com"], ["Vehement Capital", "vehement.io"],
    ["Massive Dynamic", "massivedynamic.com"], ["Wayne Enterprises", "wayne.com"],
    ["Stark Industries", "stark.io"], ["Wonka Industries", "wonka.co"],
    ["Acme Corp", "acmecorp.com"], ["Globex", "globex.io"], ["Initech", "initech.com"],
]

