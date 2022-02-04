import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { mockCall, mockWebsocket } from 'app/core/testing/utils/mock-websocket.utils';
import { IpmiSel } from 'app/interfaces/ipmi-sel.interface';
import { IxFormsModule } from 'app/modules/ix-forms/ix-forms.module';
import { FormErrorHandlerService } from 'app/modules/ix-forms/services/form-error-handler.service';
import { IpmiSelFormComponent } from 'app/pages/network/ipmi-sel-form/ipmi-sel-form.component';
import { DialogService, SystemGeneralService, WebSocketService } from 'app/services';
import { IxSlideInService } from 'app/services/ix-slide-in.service';

describe('IpmiSelFormComponent', () => {
  let spectator: Spectator<IpmiSelFormComponent>;
  let loader: HarnessLoader;
  let ws: WebSocketService;
  const mockDevices = [
    {} as IpmiSel,
    {} as IpmiSel,
    {} as IpmiSel,
  ];

  const createComponent = createComponentFactory({
    component: IpmiSelFormComponent,
    imports: [
      IxFormsModule,
      ReactiveFormsModule,
    ],
    providers: [
      mockWebsocket([
        mockCall('ipmi.query_sel', mockDevices),
        mockCall('ipmi.clear_sel'),
      ]),
      mockProvider(SystemGeneralService),
      mockProvider(IxSlideInService),
      mockProvider(FormErrorHandlerService),
      mockProvider(DialogService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    ws = spectator.inject(WebSocketService);
  });

  it('loads system event logs and shows them', async () => {
    // TODO !!!
  });

  it('clears all logs when "Clear All" button is pressed', async () => {
    
    const clearButton = await loader.getHarness(MatButtonHarness.with({ text: 'Clear All Events' }));
    await clearButton.click();

    expect(ws.call).toHaveBeenCalledWith('ipmi.clear_sel');
  });
});
