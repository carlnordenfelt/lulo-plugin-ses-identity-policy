'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Index unit tests', function () {
    var subject;
    var putIdentityPolicyStub = sinon.stub();
    var deleteIdentityPolicyStub = sinon.stub();
    var event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        var awsSdkStub = {
            SES: function () {
                this.putIdentityPolicy = putIdentityPolicyStub;
                this.deleteIdentityPolicy = deleteIdentityPolicyStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        putIdentityPolicyStub.reset().resetBehavior();
        putIdentityPolicyStub.yields(undefined);
        deleteIdentityPolicyStub.reset().resetBehavior();
        deleteIdentityPolicyStub.yields();
        event = {
            ResourceProperties: {
                Identity: 'noreply@example.com',
                PolicyName: 'PolicyName',
                Policy: {}
            }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if Identity is not set', function (done) {
            delete event.ResourceProperties.Identity;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property Identity/);
            done();
        });
        it('should fail if PolicyName is not set', function (done) {
            delete event.ResourceProperties.PolicyName;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property PolicyName/);
            done();
        });
        it('should fail if Policy is not set', function (done) {
            delete event.ResourceProperties.Policy;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property Policy/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(putIdentityPolicyStub.calledOnce).to.equal(true);
                expect(deleteIdentityPolicyStub.called).to.equal(false);
                done();
            });
        });
        it('should fail due to putIdentityPolicyError error', function (done) {
            putIdentityPolicyStub.yields('putIdentityPolicyError');
            subject.create(event, {}, function (error) {
                expect(error).to.equal('putIdentityPolicyError');
                expect(putIdentityPolicyStub.calledOnce).to.equal(true);
                expect(deleteIdentityPolicyStub.called).to.equal(false);
                done();
            });
        });
    });

    describe('update', function () {
        it('should succeed', function (done) {
            subject.update(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(putIdentityPolicyStub.calledOnce).to.equal(true);
                expect(deleteIdentityPolicyStub.called).to.equal(false);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(putIdentityPolicyStub.called).to.equal(false);
                expect(deleteIdentityPolicyStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should fail due to deleteIdentityPolicyError error', function (done) {
            deleteIdentityPolicyStub.yields('deleteIdentityPolicyError');
            subject.delete(event, {}, function (error) {
                expect(error).to.equal('deleteIdentityPolicyError');
                expect(putIdentityPolicyStub.called).to.equal(false);
                expect(deleteIdentityPolicyStub.calledOnce).to.equal(true);
                done();
            });
        });
    });
});
