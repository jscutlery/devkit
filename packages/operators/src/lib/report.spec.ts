import { report } from './report';

describe(report.name, () => {
  describe('successful source', () => {
    it.todo('should emit result with value');
  });

  describe('failed source', () => {
    it.todo('should emit result with error');
  });

  describe('pending source', () => {
    it.todo('should emit result with pending=true and without value nor error');
  });

  describe('failed source after emitting value', () => {
    it.todo('should emit result with error and without value');
  });
});
