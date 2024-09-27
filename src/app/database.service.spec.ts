import { TestBed } from '@angular/core/testing';
import { NgxIndexedDBService, NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { DatabaseService, PDFFile } from './database.service';
import { first, map } from 'rxjs/operators';

const dbConfig: DBConfig = {
  name: 'Database',
  version: 1,
  objectStoresMeta: [
    {
      store: 'users',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: true } },
        { name: 'password', keypath: 'password', options: { unique: false } }
      ]
    },
    {
      store: 'ID_card',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: true } },
        { name: 'data', keypath: 'data', options: { unique: false } }
      ]
    },
    {
      store: 'pdf_file',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: false } },
        { name: 'filename', keypath: 'filename', options: { unique: false } },
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'username_filename', keypath: ['username', 'filename'], options: { unique: true } }
      ]
    }
  ]
};

describe('DatabaseService', () => {
  let service: DatabaseService;
  let dbService: NgxIndexedDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxIndexedDBModule.forRoot(dbConfig)],
      providers: [DatabaseService]
    });
    service = TestBed.inject(DatabaseService);
    dbService = TestBed.inject(NgxIndexedDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and retrieve a PDF file', async () => {
    const username = 'testuser';
    const filename = 'testfile.pdf';
    const data = 'PDF file content';

    await service.addPDFFile(username, filename, data);

    service.getPDFFile(username, filename).pipe(
        first(),
        map(result => result as { username: string; filename: string; data: string })
      ).subscribe(result => {
        expect(result).toBeTruthy();
        expect(result.username).toBe(username);
        expect(result.filename).toBe(filename);
        expect(result.data).toBe(data);
    });
  });
});