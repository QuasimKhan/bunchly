import { File } from 'node:buffer';

if (!global.File) {
    global.File = File;
}
